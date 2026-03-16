# Adds a sortable integer timestamp (last_modified_timestamp) to each page
# so Liquid's sort filter works correctly with jekyll-last-modified-at dates.

require 'time'

Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  mod = item.data["last_modified_at"]
  if mod
    item.data["last_modified_timestamp"] = Time.parse(mod.to_s).to_i rescue 0
  else
    item.data["last_modified_timestamp"] = 0
  end
end
