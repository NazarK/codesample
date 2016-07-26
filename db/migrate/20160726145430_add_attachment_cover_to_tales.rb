class AddAttachmentCoverToTales < ActiveRecord::Migration
  def self.up
    change_table :tales do |t|
      t.attachment :cover
    end
  end

  def self.down
    remove_attachment :tales, :cover
  end
end
