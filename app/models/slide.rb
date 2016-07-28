class Slide < ActiveRecord::Base
  attr_protected []
  belongs_to :tale
  default_scope -> { order(:position)}
  has_attached_file :image,
                    :styles => { original: "2048x2048>", crop: "960x640#", :medium => "450x300>", :thumb => "150x100#" },
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  after_save do
    if self.position.blank?
      self.update_attributes position: self.id
    end
  end

  has_attached_file :audio,
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

  has_attached_file :video,
                    :storage => Rails.env=='production' ? :s3 : :filesystem
  validates_attachment_content_type :video, :content_type => /\Avideo\/.*\Z/


  validate do
    if !(self.image.present? || self.video.present?)
      self.errors[:image] << " should be image or video"
      self.errors[:video] << " should be image or video"
    end
  end
end
