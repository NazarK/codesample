class AddMediaDurationToSlide < ActiveRecord::Migration
  def change
    remove_column :slides, :duration, :float
    add_column :slides, :media_duration, :float
  end
end
