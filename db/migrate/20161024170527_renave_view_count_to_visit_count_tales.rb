class RenaveViewCountToVisitCountTales < ActiveRecord::Migration
  def change
    rename_column :tales, :view_count, :page_views
  end
end
