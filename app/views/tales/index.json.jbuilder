json.array!(@tales) do |tale|
  json.extract! tale, :id
  json.url tale_url(tale, format: :json)
end
