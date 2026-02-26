# Usage Guide

This guide provides detailed instructions for using and customizing your Jekyll site.

## Writing Content

### Creating a New Page

1. Create a new `.md` file in the root directory
2. Add front matter at the top of the file:

```markdown
---
layout: page
title: Your Page Title
permalink: /your-page/
order: 5
description: A brief description for search engines
---

Your content here...
```

### Front Matter Options

- `layout`: Use `page` for regular pages
- `title`: The page title (required)
- `permalink`: The URL for the page (required)
- `order`: Controls the order in the sidebar (lower numbers appear first)
- `description`: Used for search and SEO
- `navigation`: Set to `false` to hide from sidebar navigation

### Markdown Formatting

Use standard Markdown syntax:

```markdown
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet list
- Item 2

1. Numbered list
2. Item 2

[Link text](https://example.com)

> Blockquote

`Inline code`

​```
Code block
​```

| Table | Header |
|-------|--------|
| Cell  | Cell   |
```

## Customization

### Changing Colors

Edit `_sass/_base.scss` and modify the CSS variables:

```scss
:root {
    --primary-color: #2c3e50;      /* Header and headings */
    --secondary-color: #3498db;     /* Accent color */
    --text-color: #333;             /* Body text */
    --bg-color: #fff;               /* Background */
    --sidebar-bg: #f8f9fa;          /* Sidebar background */
    --border-color: #dee2e6;        /* Borders */
    --link-color: #3498db;          /* Links */
    --link-hover: #2980b9;          /* Link hover */
}
```

### Navigation Menus

**Top Navigation:**

Edit `_config.yml`:

```yaml
navigation:
  - title: Home
    url: /
  - title: About
    url: /about/
  - title: Your New Link
    url: /your-page/
```

**Footer Navigation:**

Edit `_config.yml`:

```yaml
footer_navigation:
  - title: GitHub
    url: https://github.com/yourusername/yourrepo
  - title: Privacy
    url: /privacy/
```

### Site Information

Edit `_config.yml`:

```yaml
title: Your Site Title
description: Your site description
baseurl: "/your-repo-name"
url: "https://yourusername.github.io"
```

## Features

### Search

The search feature is automatic. It indexes:
- Page titles (higher weight)
- Descriptions (medium weight)
- Content (normal weight)

To exclude a page from search, you would need to modify `search-data.json`.

### Table of Contents

The TOC is automatically generated from headings in your content:
- Uses h2, h3, and h4 headings
- Updates as you scroll
- Smooth scrolling when clicked

### PDF Export

The PDF export page (`/pdf-export.html`) includes all pages except:
- Pages with `navigation: false`
- The PDF export page itself

To customize what's included, edit `pdf-export.md`.

## Deployment

### Local Testing

```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# View at http://localhost:4000/signalblind
```

### GitHub Pages

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Under "Build and deployment", select "GitHub Actions"

3. The GitHub Action will automatically:
   - Build your Jekyll site
   - Deploy to GitHub Pages
   - Make it available at `https://yourusername.github.io/reponame`

### Custom Domain

To use a custom domain:

1. Add a `CNAME` file to the root with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `yourusername.github.io`

3. Update `_config.yml`:
   ```yaml
   url: "https://yourdomain.com"
   baseurl: ""
   ```

## Troubleshooting

### Build Failures

Check the GitHub Actions tab for error messages. Common issues:

- Syntax errors in `_config.yml`
- Invalid front matter in markdown files
- Missing required files

### Search Not Working

Make sure:
- `search-data.json` is being generated
- Lunr.js is loading (check browser console)
- Pages have proper front matter

### PDF Export Issues

- The PDF export uses browser print functionality
- Press Ctrl/Cmd + P and select "Save as PDF"
- Adjust print settings for best results

### Sidebar Not Showing Pages

Check that pages have:
- `title` in front matter
- `navigation` is not set to `false`
- Valid `order` number

## Advanced Customization

### Adding New Layouts

1. Create a new file in `_layouts/`
2. Include the default layout or create from scratch
3. Use in page front matter: `layout: your-layout`

### Custom CSS

Add custom styles to `_sass/` and import in `assets/css/main.scss`:

```scss
@import "base";
@import "layout";
@import "your-custom-styles";
```

### JavaScript Enhancements

Add custom JavaScript to `assets/js/` and include in `_layouts/default.html`:

```html
<script src="{{ '/assets/js/your-script.js' | relative_url }}"></script>
```

## Best Practices

1. **Use descriptive titles**: Help users and search engines understand your content
2. **Organize with order**: Use logical numbering for page order
3. **Write good descriptions**: Improve search results and SEO
4. **Test locally**: Always test before pushing to GitHub
5. **Keep it simple**: Don't over-complicate the structure
6. **Use semantic headings**: Proper heading hierarchy improves accessibility

## Support

For issues or questions:
- Check the [Jekyll documentation](https://jekyllrb.com/docs/)
- Review the [GitHub Pages documentation](https://docs.github.com/en/pages)
- Submit issues on GitHub
