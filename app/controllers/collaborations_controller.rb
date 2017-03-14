class CollaborationsController < ApplicationController
  before_action :set_collaborator, only: [:show, :edit, :update, :destroy]

  respond_to :html

  before_filter do
    @layout_user_menu = true
  end

  def index
    @collaborations = current_user.collaborations.all
    respond_with(@collaborations)
  end

  def show
    respond_with(@collaborator)
  end

  def new
    @collaboration = current_user.collaborations.new
    respond_with(@collaboration)
  end

  def edit
  end

  def create
    @collaboration = current_user.collaborations.new(collaborator_params)
    if @collaboration.save
      redirect_to collaborations_path, notice: "Collaborator added"
    else
      respond_with(@collaboration)
    end
  end

  def update
    @collaborator.update(collaborator_params)
    respond_with(@collaborator)
  end

  def destroy
    @collaborator.destroy
    respond_with(@collaborator)
  end

  private
    def set_collaborator
      @collaborator = Collaborator.find(params[:id])
    end

    def collaborator_params
      params[:collaboration].permit(:collaborator_email)
    end
end
