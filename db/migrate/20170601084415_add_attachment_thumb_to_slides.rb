class AddAttachmentThumbToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :thumb
    end
  end

  def self.down
    remove_attachment :slides, :thumb
  end
end
