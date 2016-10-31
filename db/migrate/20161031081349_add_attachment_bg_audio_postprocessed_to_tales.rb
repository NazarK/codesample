class AddAttachmentBgAudioPostprocessedToTales < ActiveRecord::Migration
  def self.up
    change_table :tales do |t|
      t.attachment :bg_audio_postprocessed
    end
  end

  def self.down
    remove_attachment :tales, :bg_audio_postprocessed
  end
end
