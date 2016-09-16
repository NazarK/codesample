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

require 'test_helper'

class TaleTest < ActiveSupport::TestCase
  test "use cover" do
    tale = Tale.new
    tale.save
    assert tale.pick_cover.include? "/loading"

    tale.slides.create! video: File.open("#{Rails.root}/test/data/video_2_sec.mp4")
    assert tale.pick_cover.include? "/loading"


    slide = tale.slides.create! image: File.open("#{Rails.root}/test/data/2.png"), 
       audio: File.open("#{Rails.root}/test/data/1.mp3")
       
    assert_equal slide.image.url, tale.pick_cover
    
  end
  
end
