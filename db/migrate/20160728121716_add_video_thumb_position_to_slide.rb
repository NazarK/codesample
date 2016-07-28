class AddVideoThumbPositionToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :video_thumb_pos, :float, default: 0
    add_column :slides, :audio_vol, :float, default: 1
  end
end
