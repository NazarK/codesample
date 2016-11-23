class AddFiltersToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :filters, :text, default: {}
  end
end
