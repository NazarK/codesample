ActiveAdmin.register Tale do
  menu priority: 2
  
  actions :all, except: [:show, :destroy, :edit]
  index do
    column :user
    column :name
    column :slides do |tale|
      tale.slides.count      
    end
    actions defaults: true do |tale|
      span link_to "View", tale.path, target: "_blank"
    end
  end
  
  filter :user
  filter :name
end
