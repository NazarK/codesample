class SlidesController < ApplicationController
  acts_as_token_authentication_handler_for User, except: :text

  before_action :set_slide, only: [:show, :edit, :update, :destroy, :text, :audio_edit]

  skip_before_action :verify_authenticity_token

  respond_to :html, :json

  before_filter :adjust_format, only: [:edit, :new, :create, :index]

  private def adjust_format
    if params[:format]=="html" || params[:format].blank?
      set_mobile_format
    end
  end

  def audio_edit
    if request.post?
      if params[:trim].present?
        @slide.audio_trim params[:trim][:start].to_f, params[:trim][:duration].to_f
      end
      if params[:cut].present?
        @slide.audio_cut params[:cut][:start].to_f, params[:cut][:duration].to_f
      end
    end
    render layout: "audio_edit"
  end

  def text


    text = @slide.text_overlay

    require "rmagick"

    image_path = @slide.image.path(:display)

    img = Magick::Image.ping(image_path).first
    width = img.columns
    height = img.rows

    img_list = Magick::ImageList.new(image_path)
    txt = Magick::Draw.new
    txt.gravity = Magick::NorthWestGravity

    x = width * (params[:left] || text[:left]).to_f/100.0
    y = height * (params[:top] || text[:top]).to_f/100.0

    txt.pointsize = (params[:font_size] || text[:font_size]).to_f*height/100.0

    txt.stroke = params[:stroke_color] || text[:stroke_color]
    txt.fill = params[:color] || text[:color]
    txt.font_weight = 400
    font = params[:font] || text[:font]
    if (params[:bold] || text[:bold])=="true"
      font += "-Bold"
    end

    txt.font = font
    require 'uri'
    text_text = URI.unescape(params[:text] || text[:text])

    img_list.annotate(txt, 0,0, x, y, text_text) {
      #txt.gravity = Magick::SouthGravity
      #txt.pointsize = size
    }

    img_list.format = "png"

    send_data img_list.to_blob, :stream => "false", :filename => "text_overlay.png", :type => "image/png", :disposition => "inline"

  end

  def index
    @slides = Slide.all
    respond_with(@slides)
  end

  def show
    if params[:format]=="json"
      return render json: @slide
    end
    respond_with(@slide)
  end

  def new
    @slide = current_user.tales.find(params[:tale_id]).slides.new
    respond_with(@slide)
  end

  def edit
  end

  def create
    @slide = current_user.tales.find(params[:tale_id]).slides.new(slide_params)
    if !@slide.save
      if is_mobile_browser?
        return render json: {error: @slide.errors[:base].join(" / ")}, status: 400
      end
    else
      if is_mobile_browser?
        return render json: @slide
      end
    end


    respond_with(@slide)
  end

  def update
    if @slide.update(slide_params)
      if is_mobile_browser? && params[:format]!="json"
        redirect_to edit_slide_path
        return
      end
    end
    render json: @slide
  end

  def destroy
    @slide.destroy
    if is_mobile_browser?
      return render nothing: true
    end
    respond_with(@slide)
  end

  private
    def set_slide
      @slide = Slide.find(params[:id])
    end

    def slide_params
      params[:slide]
    end
end
