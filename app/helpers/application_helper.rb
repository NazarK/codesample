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
end
