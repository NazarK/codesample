class AddMuteBackgroundAudioToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :mute_background_audio, :boolean, default: false
  end
end
