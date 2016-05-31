class CreateSlides < ActiveRecord::Migration
  def change
    create_table :slides do |t|
      t.references :tale, index: true, foreign_key: true
      t.text :caption

      t.timestamps null: false
    end
  end
end
