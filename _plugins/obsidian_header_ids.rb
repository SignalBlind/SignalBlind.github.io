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

  # Normalize heading anchors in markdown links to match kramdown GFM ID generation.
  # Obsidian uses case-preserving, %20-encoded anchors (e.g. #Hard%20Truths);
  # kramdown generates lowercase, hyphenated IDs (e.g. #hard-truths).
  # Skip ^anchors (block refs) which are handled separately below.
  item.content = item.content.gsub(/(\]\([^)]*?)#([^^][^)]*?\))/) do
    prefix = Regexp.last_match(1)
    anchor = Regexp.last_match(2)[0..-2] # strip trailing )

    # URL-decode
    decoded = anchor.gsub(/%([0-9A-Fa-f]{2})/) { [$1.hex].pack("C") }

    # Apply kramdown GFM ID generation: lowercase, keep word chars/spaces/hyphens, spaces to hyphens
    normalized = decoded.downcase
                        .gsub(/[^\w\s-]/, "")
                        .gsub(/\s+/, "-")
                        .gsub(/^-+|-+$/, "")

    "#{prefix}##{normalized})"
  end

  # Strip ^ from anchor references in markdown links (e.g. #^id -> #id)
  item.content = item.content.gsub(
    /(\]\([^)]*\#)\^([a-zA-Z][-a-zA-Z0-9]*\))/,
    '\1\2'
  )
end
