class AddBgYoutubeToTale < ActiveRecord::Migration
  def change
    add_column :tales, :bg_youtube, :string
  end
end
