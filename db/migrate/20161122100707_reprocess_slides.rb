class ReprocessSlides < ActiveRecord::Migration
  def change
    i = 0
    Slide.find_each do |slide|
      i+=1
      puts i if i%100==0
      slide.image.reprocess!(:display) rescue true
    end
  end
end
