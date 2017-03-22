# == Schema Information
#
# Table name: slides
#
#  id                           :integer          not null, primary key
#  tale_id                      :integer
#  caption                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  image_file_name              :string
#  image_content_type           :string
#  image_file_size              :integer
#  image_updated_at             :datetime
#  audio_file_name              :string
#  audio_content_type           :string
#  audio_file_size              :integer
#  audio_updated_at             :datetime
#  position                     :integer
#  video_file_name              :string
#  video_content_type           :string
#  video_file_size              :integer
#  video_updated_at             :datetime
#  video_thumb_pos              :float            default(0.0)
#  audio_vol                    :float            default(1.0)
#  media_duration               :float
#  youtube_video_link           :string
#  youtube_video_start          :string
#  youtube_video_end            :string
#  mute_background_audio        :boolean          default(FALSE)
#  audio_processed_file_name    :string
#  audio_processed_content_type :string
#  audio_processed_file_size    :integer
#  audio_processed_updated_at   :datetime
#  crop                         :text             default({})
#  filters                      :text             default({})
#  text_overlay                 :text             default({})
#

class Slide < ActiveRecord::Base
  strip_attributes
  attr_protected []
  belongs_to :tale
  default_scope -> { order(:position)}
  serialize :crop
  serialize :filters
  serialize :text_overlay
  has_attached_file :image,
                    :styles => {
                      original: "2048x2048>",
                      display: { :processors => [:cropper], thumb: "2048x2048>" },
                      crop: "960x640#",
                      thumb: "150x100#" },
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem



  before_validation do
    self.crop.delete_if { |key, value| value.blank? }
    if crop.blank? && crop_was.blank?
      self.restore_attributes([:crop])
    end

    if (crop_changed? || (image_updated_at_changed? && crop.present?))
      #instead of calling reprocess, which causes infinite callbacks loop
      image.assign(image)
      image.save
      #fix for cache buster
      self.image_updated_at = Time.now
    end
  end

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  has_attached_file :audio,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem
  validates_attachment_content_type :audio, :content_type => /\A(audio|video)\/.*\Z/

  has_attached_file :audio_processed,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem
  validates_attachment_content_type :audio_processed, :content_type => /\A(audio|video)\/.*\Z/


  has_attached_file :video,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem
  validates_attachment_content_type :video, :content_type => /\Avideo\/.*\Z/


  attr_accessor :delete_audio
  before_validation { audio.clear if delete_audio == '1' }

  after_save do
    if self.audio_updated_at_changed? || self.audio_vol_changed?
        self.delay.audio_process!
    end
  end

  include ApplicationHelper
  def audio_process!
    return if !self.audio.present?

    tempfile = Tempfile.new(['',File.extname(Tale.find(6).audio.path)])
    audio_volume_adjust(self.audio.path, tempfile.path, self.audio_vol)
    self.audio_processed = File.open(tempfile.path)
    self.save
    tempfile.delete
  end


  before_audio_post_process do
    media = FFMPEG::Movie.new(audio.queued_for_write[:original].path)
    puts "media duration: #{media.duration}"
    self.media_duration_will_change!
    self.media_duration = media.duration
  end

  before_video_post_process do
    media = FFMPEG::Movie.new(video.queued_for_write[:original].path)
    puts "media duration: #{media.duration}"
    self.media_duration_will_change!
    self.media_duration = media.duration
  end


  after_save do
    if self.position.blank?
      self.update_attributes position: self.id
    end
  end

  #strip caption
  before_save do
    if self.caption_changed? && !self.caption.nil?
      self.caption_will_change!
      self.caption.strip!
    end
    true
  end

  #keep only slide or video

  before_validation do
    if self.youtube_video_start.to_s.include? ":"
      self.youtube_video_start = (Time.parse("0:"+self.youtube_video_start) - Time.parse("0:0:0")).to_i.to_s
    end

    if self.youtube_video_end.to_s.include? ":"
      self.youtube_video_end = (Time.parse("0:"+self.youtube_video_end) - Time.parse("0:0:0")).to_i.to_s
    end

    if self.youtube_video_link.present?
      if self.youtube_video_link_changed? || self.media_duration.blank?
        video = VideoInfo.new(self.youtube_video_link)
        self.media_duration = video.duration
      end
    end




  end

  validate do
    if self.youtube_video_link.present?
      if self.youtube_video_end.to_i > self.media_duration
        self.errors[:youtube_video_end] << "should be lower than this video length: #{self.media_duration.to_i} sec"
      end
    end

    if self.youtube_video_end.present? && self.youtube_video_start.present?
      if self.youtube_video_end.to_i < self.youtube_video_start.to_i
        self.errors[:youtube_video_end] << "should be greater than start"
      end
    end
  end

  before_save do
    if self.image_updated_at_changed?
      self.video.clear
      self.youtube_video_link = nil
      self.youtube_video_start = nil
      self.youtube_video_end = nil
    elsif self.video_updated_at_changed?
      self.image.clear
      self.audio.clear
      self.youtube_video_link = nil
      self.youtube_video_start = nil
      self.youtube_video_end = nil
    elsif self.youtube_video_link_changed? && self.youtube_video_link.present?
      self.image.clear
      self.audio.clear
      self.video.clear
    end

    #reset media_duration if no audio or video
    if !self.video.present? && !self.audio.present? && self.youtube_video_link.blank?
      self.media_duration_will_change!
      self.media_duration = nil
    end

    true
  end

  def duration
    if self.media_duration.to_f<self.tale&.slide_duration
        self.tale&.slide_duration
    else
      if self.youtube_video_link.present?
        if self.youtube_video_end.present?
          ret = self.youtube_video_end.to_i
        else
          ret = self.media_duration
        end

        if self.youtube_video_start.present?
          ret -= self.youtube_video_start.to_i
        end
        ret
      else
        self.media_duration
      end
    end
  end

  def image_thumb
    image.url(:thumb)
  end

  def audio_url
    audio.url
  end

  def video_url
    video.url
  end

  def youtube_video_id
    regex = /(?:.be\/|\/watch\?v=|\/(?=p\/))([\w\/\-]+)/
    youtube_id = youtube_video_link.match(regex)[1]
  end

  validate do
    if !(self.image.present? || self.video.present? || self.youtube_video_link.present?)
      self.errors[:image] << " some media for the slide should be specified"
      self.errors[:video] << " some media for the slide should be specified"
      self.errors[:youtube_video_link] << "  some media for the slide should be specified"
      self.errors[:base] << "some media for the slide should be specified"
    end
  end

  def as_json(options={})
    super(methods: [:image_thumb, :audio_url, :video_url])
  end

  def no_media?
    self.youtube_video_link.blank? && self.video.blank? && self.image.blank?
  end

  #server side audio trim
  #apt install sox
  #apt install libsox-fmt-mp3
  def audio_trim start_sec, len_sec
    ext = File.extname(self.audio.path)
    tempfile = Tempfile.new(['',ext])
    self.audio.copy_to_local_file :original, tempfile

    ratestring = nil
    if ext.downcase==".mp3"
      require 'mp3info'
      Mp3Info.open(tempfile.path) do |mp3|
        ratestring = "rate #{mp3.bitrate}k"
      end
    end

    trimmed = Tempfile.new(['',ext])
    `sox #{tempfile.path} #{trimmed.path} trim #{start_sec} #{len_sec} #{ratestring}`

    self.audio = trimmed
    self.save
    tempfile.delete
    trimmed.delete
  end


  def audio_cut start_sec, len_sec
    require 'audio_trimmer'
    ext = File.extname(self.audio.path)
    tempfile = Tempfile.new(['',ext])
    self.audio.copy_to_local_file :original, tempfile

    ratestring = nil
    if ext.downcase==".mp3"
      require 'mp3info'
      Mp3Info.open(tempfile.path) do |mp3|
        ratestring = "-C #{mp3.header[:bitrate]}"
      end
    end

    part1 = Tempfile.new(['',ext])

    puts cmd = "sox #{tempfile.path} #{ratestring} #{part1.path} trim 0 #{start_sec}"
    puts `#{cmd}`


    part2 = Tempfile.new(['',ext])

    total = `soxi -D #{tempfile.path}`.to_f

    puts cmd = "sox #{tempfile.path} #{ratestring} #{part2.path} trim #{start_sec+len_sec} =#{total}"
    puts `#{cmd}`

    result = Tempfile.new(['',ext])

    puts cmd = `sox #{part1.path} #{part2.path} #{ratestring} #{result.path}`
    puts `#{cmd}`

    puts result.path
    self.audio = result
    self.save

    part1.delete
    part2.delete
    result.delete
  end

  def self.[] i
    Slide.find(i)
  end
end
