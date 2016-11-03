class SlidesController < ApplicationController
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
        redirect_to new_tale_slide_path(id:params[:tale_id]), alert: @slide.errors.full_messages.join("")
        return
      end  
    else
      if is_mobile_browser?
        redirect_to edit_tale_path(id:params[:tale_id])
        return
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
      return redirect_to edit_tale_path(@slide.tale)
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
