class Tale < ActiveRecord::Base
  attr_protected []
  has_many :slides
end
