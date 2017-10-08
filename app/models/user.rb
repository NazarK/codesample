# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0), not null
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string
#  last_sign_in_ip        :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  authentication_token   :string(30)
#

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  acts_as_token_authenticatable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  devise :omniauthable, :omniauth_providers => [:facebook]

  has_many :tales, dependent: :destroy
  has_many :collaborations
  has_many :collaborators, through: :collaborations, source: :collaborator
  has_many :teams, class_name: "Collaboration", foreign_key: :collaborator_id
  has_many :chiefs, through: :teams, source: :user

  def display_name
    "#{self.email}"
  end

  def self.from_omniauth(auth)
    user = User.find_by_email(auth.info.email)
    if user.blank?
      user = User.new
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
#      user.first_name = auth.info&.first_name || auth.info.name.split(' ')[0]   # assuming the user model has a name
#      user.last_name = auth.info&.last_name || (auth.info.name.split(' ').last if auth.info.name.split(' ').count>1)
#      user.avatar = open(auth.info.image, allow_redirections: :all)
#      user.skip_confirmation!
      user.save
    end
    user
  end

end
