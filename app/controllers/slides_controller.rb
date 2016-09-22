class SlidesController < ApplicationController
  def show
    @slide = current_user.tales.find(params[:tale_id]).slides.find(params[:id])
  end  
end