  # == Schema Information
#
# Table name: collaborators
#
#  id              :integer          not null, primary key
#  user_id         :integer
#  collaborator_id :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class Collaboration < ActiveRecord::Base
  belongs_to :user
  belongs_to :collaborator, class_name: "User"
  validates :collaborator, uniqueness: { scope: :user }

  attr_accessor :collaborator_email

  validate do
    if (collab = User.find_by_email(self.collaborator_email)).present?
      if self.user.collaborations.where(collaborator_id:collab.id).present?
        self.errors[:collaborator_email] << "already on your team"
      else
        self.collaborator = collab
      end
    else
      #TODO: send invitation
      self.errors[:collaborator_email] << "such user not found, user should be registered"
    end
  end
end
