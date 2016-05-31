class AddAttachmentImagerToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :imager
    end
  end

  def self.down
    remove_attachment :slides, :imager
  end
end
