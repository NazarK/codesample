class CreateCollaborators < ActiveRecord::Migration
  def change
    create_table :collaborations do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.integer :collaborator_id, index: true, null: false
      t.timestamps null: false
    end
  end
end
