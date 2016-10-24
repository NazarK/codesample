class AddViewCountToTale < ActiveRecord::Migration
  def change
    add_column :tales, :view_count, :integer, default: 0
  end
end
