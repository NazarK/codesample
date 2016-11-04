class HomeController < ApplicationController
  before_action :authenticate_user!, only: :mobile_app

  def index
  end
  
  def mobile_app
    render layout: "application.mobile_app"
  end
  
end
