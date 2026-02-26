# Site Maintenance Scripts

This directory contains utility scripts for managing the Jekyll site.

## convert_wikilinks.py

Converts Obsidian-style wikilinks to standard markdown links.

**Usage:**
```bash
python3 convert_wikilinks.py <directory>
```

**Example:**
```bash
python3 convert_wikilinks.py "/Users/dkoski/Library/Mobile Documents/iCloud~md~obsidian/Documents/TOM"
```

Converts:
- `[[Page Name]]` → `[Page Name](Page%20Name.md)`
- `[[Page|Alias]]` → `[Alias](Page.md)`

## extract_tags.py

Extracts inline `#hashtags` from markdown content and adds them to YAML front matter.

**Usage:**
```bash
python3 extract_tags.py <directory> [--dry-run]
```

**Example:**
```bash
# Preview what would be changed
python3 extract_tags.py . --dry-run

# Actually make the changes
python3 extract_tags.py .
```

Features:
- Finds all `#hashtag` patterns in markdown content
- Ignores hashtags in code blocks
- Adds unique tags to front matter `tags:` field
- Merges with existing tags (no duplicates)

## generate_tag_pages.py

Generates individual tag pages for Jekyll based on tags found in front matter.

**Usage:**
```bash
python3 generate_tag_pages.py <site_directory>
```

**Example:**
```bash
python3 generate_tag_pages.py .
```

Features:
- Scans all `.md` files for `tags:` in front matter
- Creates individual pages at `tags/<tagname>.md`
- Removes old tag pages and regenerates fresh set
- Each tag page uses the `tag` layout to list all pages with that tag

## Workflow: Importing Pages from Obsidian

When importing pages from your Obsidian vault:

1. **Convert wikilinks** (if needed):
   ```bash
   python3 convert_wikilinks.py "/path/to/obsidian/vault"
   ```

2. **Copy markdown files** to appropriate directories in the Jekyll site

3. **Extract tags** from hashtags:
   ```bash
   python3 extract_tags.py .
   ```

4. **Generate tag pages**:
   ```bash
   python3 generate_tag_pages.py .
   ```

5. **Test locally**:
   ```bash
   bundle exec jekyll serve
   ```

6. **Commit and push** to deploy

## Tag System

The site uses a dual approach for tags:

- **Front matter tags**: Standard Jekyll tags in YAML front matter
- **Inline hashtags**: `#hashtag` in content auto-link to tag pages via JavaScript

Both methods work together:
1. Write content with inline `#hashtags`
2. Run `extract_tags.py` to add them to front matter
3. Run `generate_tag_pages.py` to create tag pages
4. JavaScript auto-links the inline hashtags to the generated tag pages

This lets you use natural hashtag syntax in Obsidian while maintaining proper Jekyll tag infrastructure.

# Features and Notes

### Local Development

1. **Install dependencies:**
   ```bash
   bundle install
   ```

2. **Run the development server:**
   ```bash
   bundle exec jekyll serve
   ```

3. **View the site:**
   Open http://localhost:4000/signalblind in your browser

### Adding Content

1. **Create a new page:**
   - Add a `.md` file in the root directory
   - Include front matter with title, layout, permalink, and order

   Example:
   ```markdown
   ---
   layout: page
   title: My New Page
   permalink: /my-page/
   order: 4
   description: Brief description of the page
   ---

   ## Content here

   Your markdown content...
   ```

2. **Update navigation:**
   - Edit `_config.yml` to add links to top navigation
   - Pages automatically appear in the sidebar based on their `order`

### Customization

#### Colors and Styling

Edit the CSS variables in `_sass/_base.scss`:

```scss
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
    --sidebar-bg: #f8f9fa;
    --border-color: #dee2e6;
    --link-color: #3498db;
    --link-hover: #2980b9;
}
```

#### Site Configuration

Edit `_config.yml` to update:
- Site title and description
- Base URL and URL
- Navigation menus
- Footer links

#### Navigation

**Top navigation:** Edit the `navigation` section in `_config.yml`

**Footer navigation:** Edit the `footer_navigation` section in `_config.yml`

**Sidebar:** Pages automatically appear based on their front matter

### Search

- Powered by Lunr.js
- Client-side search (no server required)
- Searches titles, content, and descriptions
- Real-time results as you type

### Table of Contents

- Automatically generated from page headings (h2, h3, h4)
- Highlights current section as you scroll
- Smooth scrolling to sections

### PDF Export

- Click "Download as PDF" in the sidebar
- Linearized version of all site content
- Print-optimized layout
- Use browser's "Save as PDF" function
