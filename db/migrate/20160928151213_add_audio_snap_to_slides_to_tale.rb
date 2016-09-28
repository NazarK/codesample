class AddAudioSnapToSlidesToTale < ActiveRecord::Migration
  def change
    add_column :tales, :audio_snap_to_slides, :boolean, default: false
  end
end
