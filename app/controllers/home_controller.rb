class HomeController < ApplicationController
  def index
  end
  
  def mobile_app
    render layout: "application.mobile"
  end
  
end
