class AddMediaFitModeToTale < ActiveRecord::Migration
  def change
    add_column :tales, :media_fit_mode, :integer, default: 0
  end
end
