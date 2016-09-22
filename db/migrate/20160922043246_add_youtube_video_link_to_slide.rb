class AddYoutubeVideoLinkToSlide < ActiveRecord::Migration
  def change
    add_column :slides, :youtube_video_link, :string
    add_column :slides, :youtube_video_start, :string
    add_column :slides, :youtube_video_end, :string
  end
end
