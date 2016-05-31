class AddAttachmentAudioToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :audio
    end
  end

  def self.down
    remove_attachment :slides, :audio
  end
end
