# == Schema Information
#
# Table name: tales
#
#  id                                  :integer          not null, primary key
#  name                                :string
#  created_at                          :datetime         not null
#  updated_at                          :datetime         not null
#  user_id                             :integer
#  audio_file_name                     :string
#  audio_content_type                  :string
#  audio_file_size                     :integer
#  audio_updated_at                    :datetime
#  cover_file_name                     :string
#  cover_content_type                  :string
#  cover_file_size                     :integer
#  cover_updated_at                    :datetime
#  slide_duration                      :integer          default(4)
#  audio_vol                           :float            default(1.0)
#  captions_font                       :string
#  captions_font_size                  :integer
#  captions_letter_spacing             :integer
#  media_fit_mode                      :integer          default(0)
#  audio_snap_to_slides                :boolean          default(FALSE)
#  page_views                          :integer          default(0)
#  bg_audio_postprocessed_file_name    :string
#  bg_audio_postprocessed_content_type :string
#  bg_audio_postprocessed_file_size    :integer
#  bg_audio_postprocessed_updated_at   :datetime
#  bg_youtube                          :string
#

class Tale < ActiveRecord::Base
  strip_attributes
  attr_protected [:user_id]
  belongs_to :user
  has_many :slides
  accepts_nested_attributes_for :slides, :allow_destroy => true
  validates_associated :slides
  enum media_fit_mode: [:contain,:cover]
  validates_presence_of :user

  has_attached_file :cover,
                    :styles => { original: "2048x2048>", crop: "960x640#", :medium => "450x300>", :thumb => "150x100#" },
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem

  validates_attachment_content_type :cover, :content_type => /\Aimage\/.*\Z/


  has_attached_file :audio,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem

  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

  has_attached_file :bg_audio_postprocessed,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem
  validates_attachment_content_type :bg_audio_postprocessed, :content_type => /\Aaudio\/.*\Z/


  include ApplicationHelper

  #audio volume adjust
  after_save do
    if self.audio_updated_at_changed? || self.audio_vol_changed?
        self.delay.bg_audio_postprocess
    end
  end

  attr_accessor :bg_audio_delete
  before_validation { audio.clear if bg_audio_delete == '1' }

  before_validation do
    if self.audio_updated_at_changed? && self.audio.present?
      self.bg_youtube = nil
    end

    if self.bg_youtube_changed? && self.bg_youtube.present?
      self.audio.clear
    end
  end

  def bg_audio_postprocess
    return if !self.audio.present?

    tempfile = Tempfile.new(['',File.extname(Tale.find(6).audio.path)])
    audio_volume_adjust(self.audio.path, tempfile.path, self.audio_vol)
    self.bg_audio_postprocessed = File.open(tempfile.path)
    self.save
    tempfile.delete
  end

  def duration
    self.slides.to_a.sum &:duration
  end

  def pick_cover
    if cover.present?
      self.cover.url
    else
      first_image_slide = self.slides.where("image_file_name is not null").first
      if first_image_slide.present?
        first_image_slide.image.url
      end
    end
  end

  def cover_thumb_url
    if cover.present?
      self.cover.url(:thumb)
    else
      first_image_slide = self.slides.where("image_file_name is not null").first
      if first_image_slide.present?
        first_image_slide.image.url(:thumb)
      else
        "/slideshow-icon.png"
      end
    end
  end

  def path
    "/t#{self.id}"
  end

  def bg_youtube_id
    if self.bg_youtube.present?
      regex = /(?:.be\/|\/watch\?v=|\/(?=p\/))([\w\/\-]+)/
      self.bg_youtube.match(regex)[1] rescue nil
    end
  end

  def bg_audio_url
    audio.url
  end

  def as_json_hash
    { methods: [:bg_audio_url],

      include: {
          slides: { methods: [:audio_url, :video_url, :image_thumb]}

      }
    }
  end



end
