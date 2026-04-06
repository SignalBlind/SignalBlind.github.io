# Converts Obsidian block IDs on headers (e.g. ### Header ^my-id)
# into kramdown inline attribute lists (e.g. ### Header {#my-id})
# so Jekyll generates the correct HTML id attributes.

Jekyll::Hooks.register [:pages, :documents], :pre_render do |item|
  next unless item.extname == ".md"

  # Convert ^id on headers to kramdown {#id}
  item.content = item.content.gsub(
    /^(\#{1,6}\s+.*?)\s+\^([a-zA-Z][-a-zA-Z0-9]*)\s*$/,
    '\1 {#\2}'
  )

  # Convert ^id on its own line (block ID for preceding paragraph/element)
  # into kramdown block attribute {: #id}
  item.content = item.content.gsub(
    /^\^([a-zA-Z][-a-zA-Z0-9]*)\s*$/,
    '{: #\1}'
  )

  # Strip ^ from anchor references in markdown links (e.g. #^id -> #id)
  item.content = item.content.gsub(
    /(\]\([^)]*\#)\^([a-zA-Z][-a-zA-Z0-9]*\))/,
    '\1\2'
  )
end
