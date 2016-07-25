class Tale < ActiveRecord::Base
  attr_protected []
  belongs_to :user
  has_many :slides
  accepts_nested_attributes_for :slides, :allow_destroy => true

  has_attached_file :audio,
                    :storage => Rails.env=='production' ? :s3 : :filesystem

  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/

end
