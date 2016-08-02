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

class SlideTest < ActiveSupport::TestCase
  test "get media duration" do
    movie = FFMPEG::Movie.new("#{Rails.root}/test/data/long.mp3")
    puts "movie duration: #{movie.duration}"
    assert movie.duration > 9
    
    movie = FFMPEG::Movie.new("#{Rails.root}/test/data/video_8_sec.mp4")
    puts "movie duration: #{movie.duration}"
    assert movie.duration > 8
        
  end
  
  test 'slide media duration' do
    slide = Slide.create! image: File.open("#{Rails.root}/test/data/2.png"), 
       audio: File.open("#{Rails.root}/test/data/1.mp3")

    audio_duration = slide.media_duration
    assert slide.media_duration > 1

    slide = Slide.create! video: File.open("#{Rails.root}/test/data/video_2_sec.mp4")
    assert slide.media_duration > 1
    
    slide.image = File.open("#{Rails.root}/test/data/2.png")
    slide.save
    
    assert_equal nil,slide.media_duration
    
  end
  
  test 'slide duration' do
    tale = Tale.create! slide_duration: 4    
    tale.slides.create! image: File.open("#{Rails.root}/test/data/2.png")
    
    assert_equal 4, tale.slides.last.duration
    
    tale.slides.create! image: File.open("#{Rails.root}/test/data/2.png"),
      audio: File.open("#{Rails.root}/test/data/long.mp3")
    
    assert tale.slides.last.duration>4
    
    
    assert tale.duration == (tale.slides.first.duration + tale.slides.last.duration)
    
  end
end
