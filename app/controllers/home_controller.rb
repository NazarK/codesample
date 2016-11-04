class HomeController < ApplicationController
  def index
  end
  
  def test
    render layout: "application.mobile"
  end
  
end
