class TalesController < ApplicationController
  before_action :set_tale, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @tales = Tale.all
    respond_with(@tales)
  end

  def show
    render layout: "yarntale"
  end

  def new
    @tale = Tale.new
    respond_with(@tale)
  end

  def edit
  end

  def create
    @tale = Tale.new(tale_params)
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
      @tale = Tale.find(params[:id])
    end

    def tale_params
      params[:tale]
    end
end
