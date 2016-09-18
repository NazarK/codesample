class AddCaptionsLetterSpacingToTale < ActiveRecord::Migration
  def change
    add_column :tales, :captions_letter_spacing, :integer
  end
end
