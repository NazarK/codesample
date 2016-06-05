class TalesController < ApplicationController
  before_action :set_tale, only: [:show, :edit, :update, :destroy]

  respond_to :html

  def index
    @tales = Tale.all
    respond_with(@tales)
  end

  def show
    respond_with(@tale)
  end

  def new
    @tale = Tale.new
    respond_with(@tale)
  end

  def edit
  end

  def create
    @tale = Tale.new(tale_params)
    flash[:notice] = 'Tale was successfully created.' if @tale.save
    respond_with(@tale)
  end

  def update
    flash[:notice] = 'Tale was successfully updated.' if @tale.update(tale_params)
    respond_with(@tale)
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
