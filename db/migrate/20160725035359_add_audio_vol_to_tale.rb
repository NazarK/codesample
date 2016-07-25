class AddAudioVolToTale < ActiveRecord::Migration
  def change
    add_column :tales, :audio_volume, :integer, default: 100
  end
end
