class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include ActiveDevice
  skip_before_filter :set_mobile_format
  
  def after_sign_in_path_for(resource)
    if is_mobile_browser?
      "/m"
    else
      "/"
    end
  end


  before_filter :add_cors_headers
  def add_cors_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, PUT, DELETE, GET, OPTIONS'
    headers['Access-Control-Request-Method'] = '*'
    headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'    
  end
    
end
