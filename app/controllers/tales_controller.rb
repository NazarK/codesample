class TalesController < ApplicationController
  before_action :authenticate_user!, except: :show
  before_action :set_tale, only: [:show, :edit, :update, :destroy,:embed]

  respond_to :html

  def embed

  end

  def index
    @tales = current_user.tales
    respond_with(@tales)
  end

  def show
    render layout: "yarntale"
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
      flash[:notice] = 'Tale was successfully created.'
      redirect_to tales_path
    else
      respond_with(@tale)
    end
  end

  def update
    if @tale.update(tale_params)
      flash[:notice] = 'Tale was successfully updated.'
      redirect_to tales_path
    else
      respond_with(@tale)
    end
  end

  def destroy
    @tale.destroy
    respond_with(@tale)
  end

  private
    def set_tale
      @tale = current_user.tales.find(params[:id])
    end

    def tale_params
      params[:tale]
    end
end
