class Tale < ActiveRecord::Base
  attr_protected [:user_id]
  belongs_to :user
  has_many :slides
  accepts_nested_attributes_for :slides, :allow_destroy => true

  has_attached_file :cover,
                    :styles => { original: "2048x2048>", crop: "960x640#", :medium => "450x300>", :thumb => "150x100#" },
                    :storage => Rails.env=='production' ? :s3 : :filesystem

  validates_attachment_content_type :cover, :content_type => /\Aimage\/.*\Z/


  has_attached_file :audio,
                    :storage => Rails.env=='production' ? :s3 : :filesystem

  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

end
