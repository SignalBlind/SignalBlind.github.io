module Jekyll
  class SortedNavigationGenerator < Generator
    safe true
    priority :low

    EXCLUDED_DIRS = %w[_pages tags assets tools].freeze

    def generate(site)
      categories = {}
      top_level = []

      nav_excludes = site.config["exclude_from_nav"] || []

      site.pages.each do |page|
        next if page.data["navigation"] == false
        next if nav_excludes.any? { |pattern| page.url == pattern || page.url.start_with?(pattern) }

        category = effective_category(page)
        display_title = resolve_title(page)
        order = page.data["order"]

        entry = {
          "display_title" => display_title,
          "order"         => order,
          "url"           => page.url,
          "path"          => page.path
        }

        if category && !category.empty?
          categories[category] ||= []
          categories[category] << entry
        elsif display_title && !display_title.empty?
          top_level << entry.merge("type" => "page")
        end
      end

      nav = []

      categories.each do |name, children|
        sorted_children = sort_children(children)
        min_order = children.filter_map { |c| c["order"] }.min || 999
        nav << {
          "type"          => "category",
          "display_title" => name,
          "order"         => min_order,
          "children"      => sorted_children
        }
      end

      top_level.each do |entry|
        entry["order"] ||= 999
        nav << entry
      end

      nav.sort_by! { |item| [item["order"] || 999, item["display_title"].downcase] }

      site.data["sorted_navigation"] = nav
    end

    private

    def effective_category(page)
      explicit = page.data["category"]
      return explicit if explicit && !explicit.empty?

      parts = page.path.split("/")
      return nil if parts.size <= 1

      first_dir = parts[0]
      return nil if EXCLUDED_DIRS.include?(first_dir)
      return nil if first_dir.start_with?("_")

      first_dir
    end

    def resolve_title(page)
      title = page.data["title"]
      return title if title && !title.empty?

      filename = File.basename(page.path, File.extname(page.path))
      filename.tr("-_", "  ")
    end

    def sort_children(children)
      ordered, unordered = children.partition { |c| c["order"] }
      ordered.sort_by! { |c| c["order"] }
      unordered.sort_by! { |c| c["display_title"].downcase }
      ordered + unordered
    end
  end
end
