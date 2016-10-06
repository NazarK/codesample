ActiveAdmin.register User do
  permit_params :email, :password, :password_confirmation
  menu priority: 1
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
    column :email
    column :last_sign_in_at
    column :sign_in_count
    actions
  end

  form do |f|
    f.inputs "" do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end


end
