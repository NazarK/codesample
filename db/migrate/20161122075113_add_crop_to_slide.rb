class AddCropToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :crop, :text, default: {}
  end
end
