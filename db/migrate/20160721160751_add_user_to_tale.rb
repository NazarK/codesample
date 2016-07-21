class AddUserToTale < ActiveRecord::Migration
  def change
    add_reference :tales, :user, index: true, foreign_key: true
  end
end
