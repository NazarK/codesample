Rails.application.routes.draw do
  get "/test" => "home#test"
  get "/m(*path)" => "home#mobile_app"
  get "/text_overlay" => "home#text_overlay"

  devise_for :users, controllers: {
          sessions: 'users/sessions',
          registrations: 'users/registrations'
  }

  devise_scope :user do
    authenticated :user do
      root 'tales#index', as: :authenticated_root
    end

    unauthenticated do
      root 'users/sessions#new', as: :unauthenticated_root
    end
  end

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)


  resources :tales do
    get :embed, on: :member
    get :test, on: :collection
    #this is for internal testing only
    resources :slides, only: [:show, :create, :new, :index] do
      match :audio_edit, on: :member, via: :all
    end
  end

  resources :slides do
    get :text, on: :member
  end

  resources :collaborations


  get '/t:id/edit' => "tales#edit"
  get '/t:id(/:mode)' => "tales#show"

end
