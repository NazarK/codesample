json.array!(@tales) do |tale|
  json.extract! tale, :id, :name
  json.duration_h Time.at(tale.duration).utc.strftime("%H:%M:%S")
  json.slides_count tale.slides.count
end
