json.array!(@collaborators) do |collaborator|
  json.extract! collaborator, :id
  json.url collaborator_url(collaborator, format: :json)
end
