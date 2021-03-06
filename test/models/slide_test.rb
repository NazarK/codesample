# == Schema Information
#
# Table name: slides
#
#  id                           :integer          not null, primary key
#  tale_id                      :integer
#  caption                      :text
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  image_file_name              :string
#  image_content_type           :string
#  image_file_size              :integer
#  image_updated_at             :datetime
#  audio_file_name              :string
#  audio_content_type           :string
#  audio_file_size              :integer
#  audio_updated_at             :datetime
#  position                     :integer
#  video_file_name              :string
#  video_content_type           :string
#  video_file_size              :integer
#  video_updated_at             :datetime
#  video_thumb_pos              :float            default(0.0)
#  audio_vol                    :float            default(1.0)
#  media_duration               :float
#  youtube_video_link           :string
#  youtube_video_start          :string
#  youtube_video_end            :string
#  mute_background_audio        :boolean          default(FALSE)
#  audio_processed_file_name    :string
#  audio_processed_content_type :string
#  audio_processed_file_size    :integer
#  audio_processed_updated_at   :datetime
#  crop                         :text             default({})
#  filters                      :text             default({})
#  text_overlay                 :text             default({})
#

require 'test_helper'

class SlideTest < ActiveSupport::TestCase
  test 'saves slide file' do
    slide = Slide.create! video: File.open("#{Rails.root}/test/data/video_2_sec.mp4")
    assert File.exists?("#{Rails.root}/public#{slide.video.url.split('?')[0]}")
    assert File.exists?(slide.video.path)
  end
  
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
  
  test 'delete audio' do
    slide = Slide.create! image: File.open("#{Rails.root}/test/data/2.png"), 
       audio: File.open("#{Rails.root}/test/data/1.mp3")
    assert slide.audio.present?   
    slide.delete_audio = "1"
    slide.save
    
    slide.reload
    assert slide.audio.blank?   
    
  end
  
  
end
