#!/usr/bin/env ruby
# Finds .md files with no `title` in front matter but a leading `# Title`
# in the body, then moves the h1 into front matter and removes it from the body.
#
# Usage: ruby _scripts/promote_h1_to_title.rb [--dry-run]

require "yaml"

DRY_RUN = ARGV.include?("--dry-run")

EXCLUDED_DIRS = %w[.claude .obsidian .git _site _scripts node_modules vendor].freeze

files = Dir.glob("**/*.md").reject do |path|
  EXCLUDED_DIRS.any? { |d| path.start_with?("#{d}/") }
end

changed = 0

files.each do |path|
  content = File.read(path)

  # Must have front matter
  next unless content.start_with?("---\n")

  # Split into front matter and body
  parts = content.split("---\n", 3)
  next if parts.size < 3

  fm_raw = parts[1]
  body = parts[2]

  # Skip if front matter already has a title
  fm = YAML.safe_load(fm_raw) || {}
  next if fm["title"] && !fm["title"].to_s.strip.empty?

  # Check if body starts with # Title (allow leading blank lines)
  lines = body.lines
  h1_index = lines.index { |l| l.match?(/\A#\s+\S/) }
  next unless h1_index

  # Only promote if everything before the h1 is blank
  next unless lines[0...h1_index].all? { |l| l.strip.empty? }

  h1_line = lines[h1_index]
  title = h1_line.sub(/\A#\s+/, "").strip

  # Remove the h1 line (and one trailing blank line if present)
  remaining = lines[(h1_index + 1)..]
  remaining.shift if remaining.first&.strip&.empty?
  new_body = remaining.join

  # Add title to front matter
  fm["title"] = title
  # Rebuild front matter preserving key order: layout first, then title, then rest
  ordered_keys = []
  ordered_keys << "layout" if fm.key?("layout")
  ordered_keys << "title"
  fm.each_key { |k| ordered_keys << k unless ordered_keys.include?(k) }
  new_fm = ordered_keys.map { |k| "#{k}: #{fm[k]}" }.join("\n")

  new_content = "---\n#{new_fm}\n---\n#{new_body}"

  if DRY_RUN
    puts "WOULD UPDATE: #{path} => title: #{title}"
  else
    File.write(path, new_content)
    puts "UPDATED: #{path} => title: #{title}"
  end
  changed += 1
end

puts "\n#{DRY_RUN ? "Would update" : "Updated"} #{changed} file(s)."
