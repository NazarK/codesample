class AddAttachmentVideoToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :video
    end
  end

  def self.down
    remove_attachment :slides, :video
  end
end
