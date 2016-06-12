class Tale < ActiveRecord::Base
  attr_protected []
  has_many :slides
  accepts_nested_attributes_for :slides, :allow_destroy => true
end
