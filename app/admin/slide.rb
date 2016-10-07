ActiveAdmin.register Slide do
  menu false
  index do
    column :id
    column :caption
    column :media do |slide|
      if slide.video.present?
        span video_tag slide.video.url, controls: true, style: "width:200px"
      end  
      if slide.image.present?
        span image_tag slide.image.url, style: "width:200px"
      end  
    end
    column :audio do |slide|
      if slide.audio.present?
        span audio_tag slide.audio.url, controls: true
      end  
    end  
    actions
  end
end
