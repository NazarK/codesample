module ApplicationHelper
  def flash_messages(opts = {})
    bootstrap_classes = { "success" => "alert-success",
      "error" => "alert-danger",
      "alert" => "alert-warning",
      "notice" => "alert-info" }

    flash.each do |msg_type, message|
      concat(content_tag(:div, message, class: "alert #{bootstrap_classes[msg_type] || msg_type} fade in") do
              concat content_tag(:button, 'x', class: "close", data: { dismiss: 'alert' })
              concat message
            end)
    end
    nil
  end
  
  def audio_volume_adjust input_file, output_file, volume
    ffmpeg = FFMPEG::Movie.new input_file
    ffmpeg.transcode output_file, "-af 'volume=#{volume}'"
  end  
end
