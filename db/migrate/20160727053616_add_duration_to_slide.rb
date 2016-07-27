class AddDurationToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :duration, :float
  end
end
