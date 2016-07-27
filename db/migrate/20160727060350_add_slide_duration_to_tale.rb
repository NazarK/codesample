class AddSlideDurationToTale < ActiveRecord::Migration
  def change
    add_column :tales, :slide_duration, :integer, default: 4
  end
end
