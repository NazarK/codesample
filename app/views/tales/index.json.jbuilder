json.array!(@tales) do |tale|
  json.extract! tale, :id, :name, :page_views
  json.duration_h Time.at(tale.duration).utc.strftime("%H:%M:%S")
  json.cover_url tale.pick_cover || "/slideshow-icon.png"
  json.slides_count tale.slides.count
end
