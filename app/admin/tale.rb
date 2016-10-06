ActiveAdmin.register Tale do
  menu priority: 2
  
  index do
    selectable_column
    column :user
    column :title
    actions
  end
end
