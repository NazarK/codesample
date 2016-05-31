class Slide < ActiveRecord::Base
  belongs_to :tale
  has_attached_file :image,
                    :styles => { original: "2048x2048>", :medium => "300x300>", :thumb => "100x100>" },
                    :storage => :s3,
                    :path => ":class/:attachment/:id/:style.:extension",
                    :s3_host_name => "s3.eu-central-1.amazonaws.com"

  validates_attachment_content_type :image, :content_type => /\Aimage\/.*\Z/

  has_attached_file :audio,
                    :storage => :s3,
                    :path => ":class/:attachment/:id/:style.:extension",
                    :s3_host_name => "s3.eu-central-1.amazonaws.com"

  validates_attachment_content_type :image, :content_type => /\Aaudio\/.*\Z/

end
