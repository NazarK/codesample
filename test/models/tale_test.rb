# == Schema Information
#
# Table name: tales
#
#  id                      :integer          not null, primary key
#  name                    :string
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  user_id                 :integer
#  audio_file_name         :string
#  audio_content_type      :string
#  audio_file_size         :integer
#  audio_updated_at        :datetime
#  cover_file_name         :string
#  cover_content_type      :string
#  cover_file_size         :integer
#  cover_updated_at        :datetime
#  slide_duration          :integer          default(4)
#  audio_vol               :float            default(1.0)
#  captions_font           :string
#  captions_font_size      :integer
#  captions_letter_spacing :integer
#  media_fit_mode          :integer          default(0)
#  audio_snap_to_slides    :boolean          default(FALSE)
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
