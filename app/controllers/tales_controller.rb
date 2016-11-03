class TalesController < ApplicationController
  before_action :authenticate_user!, except: :show
  before_action :set_tale, only: [:show, :edit, :update, :destroy,:embed]
  skip_before_filter :verify_authenticity_token

  respond_to :html, :json

  before_filter :adjust_format, only: [:index,:test]
  
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
    @tales = current_user.tales.order("id desc")
    respond_with(@tales)
  end

  def show
    @tale.update_attributes page_views: (@tale.page_views+1)
    response.headers.delete('X-Frame-Options')
    render layout: "show"
  end

  def new
    @tale = current_user.tales.new
    respond_with(@tale)
  end

  def edit
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
    if @tale.update(tale_params)
      flash.now[:notice] = 'Tale was successfully updated.'
    end
    render :edit
  end

  def destroy
    @tale.destroy
    respond_with(@tale)
  end

  private
    def set_tale
      if params[:action] == "show"
        @tale = Tale.find(params[:id])
      else
        @tale = current_user.tales.find(params[:id])
      end
    end

    def tale_params
      params[:tale]
    end
end
