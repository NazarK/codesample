ActiveAdmin.register Slide do
  menu false

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if params[:action] == 'create' && current_user.admin?
#   permitted
# end

  index do
    selectable_column
    id_column
    column :tale
    column :image do |r|
      link_to image_tag(r.image.url(:thumb)), r.image.url(:original), target: "_blank"
    end
    column :image_size do |r|
      (r.image_file_size.to_f / 1000).to_i.to_s+"kb"
    end
    column :audio do |r|
      link_to r.audio_file_name, r.audio.url, target: "_blank"
    end
    column :audio_size do |r|
      (r.audio_file_size.to_f / 1000).to_i.to_s+"kb"
    end
    column :caption
    actions
  end

  form do |f|
    f.inputs "" do
      f.input :tale
      f.input :image, as: :file
      f.input :audio, as: :file
      f.input :caption
    end
    f.actions
  end



end
