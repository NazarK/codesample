class CreateTales < ActiveRecord::Migration
  def change
    create_table :tales do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
