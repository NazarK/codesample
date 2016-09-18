class AddCaptionsFontSizeToTale < ActiveRecord::Migration
  def change
    add_column :tales, :captions_font_size, :integer
  end
end
