json.array!(@tales) do |tale|
  json.extract! tale, :id, :name
end
