ActiveAdmin.register Tale do
  menu priority: 1
  
  actions :all, except: [:destroy, :edit]
  index do
    column :id
    column :name
    column :user
    column :created_at
    column :slides do |tale|
      tale.slides.count      
    end
    column :page_views
    actions defaults: true do |tale|
      span link_to "Play", tale.path, target: "_blank"
    end
  end
  
  show do |tale|
    attributes_table do
      row :id
      row :user
      row :name
      row :slides do |tale|
        tale.slides.count
      end
      row :page_views
    end
    
    panel "Slides" do
      table_for tale.slides.order("position") do 
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
      end
    end    
  end  
  
  filter :user
  filter :name
end
