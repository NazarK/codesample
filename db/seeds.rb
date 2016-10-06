# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
AdminUser.create(email: 'admin@yarntale.com', password: '12345678')
User.create(email: "demo@demo.com", password: '12345678')


(1..4).each do |i|
  tale = User.find_by_email("demo@demo.com").tales.create name: "test tale #{i}"

  slides_num = 10
  if i==1
    slides_num = 30
  end

  if i==3
    slides_num = 1
    tale.name = "slides and video"
    tale.save
  end

  if i==4
    slides_num = 3
    tale.name = "with 3 slides"
    tale.save
  end

  (1..slides_num).each do |slide_num|
    j = 1 + (slide_num-1) % 3
    puts "image: #{j}.png"
    audio = "#{j}.mp3"

    if i==1 && slide_num==1
      audio = "long.mp3"
    end

    tale.slides.create! image: File.open("#{Rails.root}/test/data/#{j}.png"), audio: File.open("#{Rails.root}/test/data/#{audio}"),
                       caption: "slide number #{slide_num} - "+Faker::Hipster.paragraphs(1+rand(3)).first
  end

  if i==3
    tale.slides.create video: File.open("#{Rails.root}/test/data/video_8_sec.mp4"), caption: "video 8 seconds"
    tale.slides.create video: File.open("#{Rails.root}/test/data/video_2_sec.mp4"), caption: "video 2 seconds"
    tale.slides.create image: File.open("#{Rails.root}/test/data/2.png"), caption: "image", audio: File.open("#{Rails.root}/test/data/2.mp3")

    tale.save
  end

  if i==1
    tale.audio = File.open("#{Rails.root}/test/data/background_audio.mp3")
    tale.audio_vol = 0.5
    tale.name = tale.name + " - with background audio"

    tale.cover = File.open("#{Rails.root}/test/data/cover.jpg")
    tale.save
  end
end

#tale for background audio loop testing

tale = User.find_by_email("demo@demo.com").tales.create name: "loop background audio"
tale.audio = File.open("#{Rails.root}/test/data/1.mp3")
tale.audio_vol = 0.5
tale.save
tale.slides.create! image: File.open("#{Rails.root}/test/data/1.png"), 
                   caption: "slide number 1 - "+Faker::Hipster.paragraphs(1+rand(3)).first
tale.slides.create! image: File.open("#{Rails.root}/test/data/2.png"), 
                  caption: "slide number 2 - "+Faker::Hipster.paragraphs(1+rand(3)).first
tale.slides.create! image: File.open("#{Rails.root}/test/data/3.png"), 
                   caption: "slide number 3 - "+Faker::Hipster.paragraphs(1+rand(3)).first


#creating slide with no audio
slide = Tale.first.slides.second
slide.caption = "no audio in this slide "+slide.caption
slide.audio.destroy
slide.save
