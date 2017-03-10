ActiveAdmin.register Tale do
  menu priority: 1
  permit_params :user_id

  actions :all, except: [:destroy]
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


  controller do
    def update
      super do |success,failure|
        success.html { redirect_to collection_path }
      end
    end
  end

  form do |f|
    f.inputs do
      f.input :user, include_blank: false
    end
    f.actions
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
