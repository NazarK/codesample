class ChangeAudioVolumeForTale < ActiveRecord::Migration
  def change
    remove_column :tales, :audio_volume, :integer
    add_column :tales, :audio_vol, :float, default: 1
  end
end
