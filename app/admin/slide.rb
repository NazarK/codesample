ActiveAdmin.register Slide do

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


  form do |f|
    f.inputs "" do
      f.input :tale
      f.input :image, as: :file
      f.input :audio, as: :file
    end
    f.actions
  end



end
