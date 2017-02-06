class AddTextToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :text_overlay, :text, default: {}
  end
end
