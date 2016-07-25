class AddAttachmentAudioToTales < ActiveRecord::Migration
  def self.up
    change_table :tales do |t|
      t.attachment :audio
    end
  end

  def self.down
    remove_attachment :tales, :audio
  end
end
