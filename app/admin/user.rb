ActiveAdmin.register User do
  permit_params :email, :password, :password_confirmation
  menu priority: 2
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

  member_action :become do
    sign_in(:user, User.find(params[:id]))
    redirect_to "/"
  end

  index do
    column :email
    column :tales do |user|
      user.tales.count
    end
    column :last_sign_in_at
    column :sign_in_count
    actions do |resource|
      span link_to "Log in", become_admin_user_path(resource.id), data: {confirm: "Log in as this user?"}, title: "Login to site as this user"
    end
  end

  form do |f|
    f.inputs "" do
      f.input :email
      f.input :password
      f.input :password_confirmation
    end
    f.actions
  end
  
  
  show do |user|
    attributes_table do
      row :email
    end
    
    panel "Tales" do
      table_for user.tales.order("id desc") do 
        column :id
        column :name do |tale|
          link_to tale.name, admin_tale_path(tale)
        end
        column :slides do |tale|
          tale.slides.count
        end
        column :created_at
        column "" do |tale|
          span link_to "Play", tale.path, target: "_blank"
        end
      end
    end    
  end  

  filter :email

end
