class TalesController < ApplicationController

  acts_as_token_authentication_handler_for User, except: :show

  before_action :set_tale, only: [:show, :edit, :update, :destroy,:embed]
  skip_before_filter :verify_authenticity_token


  respond_to :html, :json

  before_filter do
    if is_mobile_browser? && !params[:format]=="json"
      redirect_to "/m"
      false
    end
  end

  before_filter :adjust_format, only: [:test,:edit,:new, :update]

  private def adjust_format
    if params[:format]=="html" || params[:format].blank?
      set_mobile_format
    end
  end

  def test
  end

  def embed
  end

  def index
    @page_title = " | Tales"
    @tales = current_user.tales.order("id desc").to_a
    current_user.chiefs.each do |chief|
      @tales += chief.tales.to_a
    end

    respond_with(@tales)
  end

  def show
    if params[:format]=="json"
      render json: @tale.to_json(@tale.as_json_hash)
      return
    end

    @tale.update_attributes page_views: (@tale.page_views+1)
    response.headers.delete('X-Frame-Options')
    render layout: "show"
  end

  def new
    @tale = current_user.tales.new
    respond_with(@tale)
  end

  def edit
    @page_title  = " Edit | #{@tale.name}"
  end

  def create
    @tale = current_user.tales.new(tale_params)
    if @tale.save
      flash.now[:notice] = 'Tale was successfully created.'
      render :edit
    else
      render :create
    end
  end

  def update
    if params[:ids_ordered].present?
      params[:ids_ordered].each_with_index do |id,i|
        @tale.slides.find(id).update_attributes position: (i+1)
      end
      return render nothing: true
    end

    if @tale.update(tale_params)
      if is_mobile_browser?
        return  redirect_to edit_tale_path(@tale)
      end
      flash.now[:notice] = 'Tale was successfully updated.'
    end
    render :edit
  end

  def destroy
    #can destroy only your own tales
    @tale = current_user.tales.find(@tale)
    @tale.destroy
    if is_mobile_browser?
      return render nothing: true
    end
    respond_with(@tale)
  end

  private
    def set_tale
      if params[:action] == "show"
        @tale = Tale.find(params[:id])
      else
        @tale = Tale.find(params[:id])
        if ! (current_user == @tale.user || current_user.chiefs.include?(@tale.user))
          render text: "access denied"
        end
      end
    end

    def tale_params
      params[:tale]
    end
end
