class AddCaptionsFontToTale < ActiveRecord::Migration
  def change
    add_column :tales, :captions_font, :string
  end
end
