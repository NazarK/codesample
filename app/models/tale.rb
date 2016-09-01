# == Schema Information
#
# Table name: tales
#
#  id                 :integer          not null, primary key
#  name               :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  user_id            :integer
#  audio_file_name    :string
#  audio_content_type :string
#  audio_file_size    :integer
#  audio_updated_at   :datetime
#  cover_file_name    :string
#  cover_content_type :string
#  cover_file_size    :integer
#  cover_updated_at   :datetime
#  slide_duration     :integer          default(4)
#  audio_vol          :float            default(1.0)
#

class Tale < ActiveRecord::Base
  attr_protected [:user_id]
  belongs_to :user
  has_many :slides
  accepts_nested_attributes_for :slides, :allow_destroy => true
  validates_associated :slides

  has_attached_file :cover,
                    :styles => { original: "2048x2048>", crop: "960x640#", :medium => "450x300>", :thumb => "150x100#" },
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem

  validates_attachment_content_type :cover, :content_type => /\Aimage\/.*\Z/


  has_attached_file :audio,
                    :storage => ENV['S3_STORAGE']=='true' ? :s3 : :filesystem

  validates_attachment_content_type :audio, :content_type => /\Aaudio\/.*\Z/


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
      else
        "/loading.jpg"
      end    
    end  
  end    
end
