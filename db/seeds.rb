# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
AdminUser.create!(email: 'admin@admin.com', password: '12345678')


(1..2).each do |i|
  tale = Tale.create name: "test tale #{i}"

  (1..4).each do |slide_num|
    j = 1 + (slide_num-1) % 3
    tale.slides.create image: File.open("#{Rails.root}/public/sample_data/#{j}.png"), audio: File.open("#{Rails.root}/public/sample_data/#{j}.mp3"), caption: "slide number #{slide_num}"
  end
end
