class AddAttachmentAudioProcessedToSlides < ActiveRecord::Migration
  def self.up
    change_table :slides do |t|
      t.attachment :audio_processed
    end
  end

  def self.down
    remove_attachment :slides, :audio_processed
  end
end
