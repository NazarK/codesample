class SlidesController < ApplicationController
  acts_as_token_authentication_handler_for User

  before_action :set_slide, only: [:show, :edit, :update, :destroy]

  skip_before_action :verify_authenticity_token
  
  respond_to :html, :json

  before_filter :adjust_format, only: [:edit, :new, :create, :index]
  
  private def adjust_format
    if params[:format]=="html" || params[:format].blank?
      set_mobile_format
    end  
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
      if is_mobile_browser?
        redirect_to edit_slide_path
        return
      end
    end  
    
    respond_with(@slide)
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
