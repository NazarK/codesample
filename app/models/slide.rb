class Slide < ActiveRecord::Base
  attr_protected []
  belongs_to :tale
  default_scope -> { order(:position)}
  has_attached_file :image,
                    :styles => { original: "2048x2048>", :medium => "300x300>", :thumb => "100x100#" },
                    :storage => Rails.env=='production' ? :s3 : :filesystem

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  has_attached_file :audio,
                    :storage => Rails.env=='production' ? :s3 : :filesystem

  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

  validates_presence_of :image, :audio

end
