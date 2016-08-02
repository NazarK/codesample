# == Schema Information
#
# Table name: slides
#
#  id                 :integer          not null, primary key
#  tale_id            :integer
#  caption            :text
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  image_file_name    :string
#  image_content_type :string
#  image_file_size    :integer
#  image_updated_at   :datetime
#  audio_file_name    :string
#  audio_content_type :string
#  audio_file_size    :integer
#  audio_updated_at   :datetime
#  position           :integer
#  video_file_name    :string
#  video_content_type :string
#  video_file_size    :integer
#  video_updated_at   :datetime
#  video_thumb_pos    :float            default(0.0)
#  audio_vol          :float            default(1.0)
#  media_duration     :float
#

class Slide < ActiveRecord::Base
  attr_protected []
  belongs_to :tale
  default_scope -> { order(:position)}
  has_attached_file :image,
                    :styles => { original: "2048x2048>", crop: "960x640#", thumb: "150x100#" },
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  has_attached_file :audio,
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

  has_attached_file :video,
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :video, :content_type => /\Avideo\/.*\Z/


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
  before_save do
    if self.image_updated_at_changed?
      self.video.clear
    elsif self.video_updated_at_changed?
      self.image.clear
      self.audio.clear
    end

    #reset media_duration if no audio or video
    if !self.video.present? && !self.audio.present?
      self.media_duration_will_change!
      self.media_duration = nil
    end

    true
  end

  def duration
    if self.media_duration.to_f<self.tale&.slide_duration
        self.tale&.slide_duration
    else
      self.media_duration
    end      
  end  

  validate do
    if !(self.image.present? || self.video.present?)
      self.errors[:image] << " should be image or video"
      self.errors[:video] << " should be image or video"
    end
  end
end
