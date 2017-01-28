module Paperclip
  class Cropper < Thumbnail
    def transformation_command
      if crop_command
        crop_command + super.join(' ').sub(/ -crop \S+/, '').split(' ')
      else
        super
      end
    end

    def crop_command
      target = @attachment.instance
      if target.crop.present?
        ["-crop", "#{target.crop[:w].to_i}x#{target.crop[:h].to_i}+#{target.crop[:x].to_i}+#{target.crop[:y].to_i}"]
      end
    end
  end
end
