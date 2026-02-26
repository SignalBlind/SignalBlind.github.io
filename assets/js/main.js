// Main JavaScript for site functionality

// Toggle category expand/collapse
function toggleCategory(header) {
    const categoryItem = header.parentElement;
    const children = categoryItem.querySelector('.category-children');
    const toggle = header.querySelector('.category-toggle');

    if (children.style.display === 'none') {
        children.style.display = 'block';
        toggle.textContent = '▼';
        categoryItem.classList.add('expanded');
    } else {
        children.style.display = 'none';
        toggle.textContent = '▶';
        categoryItem.classList.remove('expanded');
    }
}

// Generate table of contents for current page
function generateTOC() {
    const content = document.querySelector('.content');
    const tocContainer = document.getElementById('sidebar-toc');

    if (!content || !tocContainer) return;

    const headings = content.querySelectorAll('h2, h3, h4');

    if (headings.length === 0) {
        tocContainer.innerHTML = '<p class="no-toc">No headings in this page</p>';
        return;
    }

    let tocHTML = '<ul>';
    let currentLevel = 2;

    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent;
        const id = heading.id || `heading-${index}`;

        // Add ID if not present
        if (!heading.id) {
            heading.id = id;
        }

        // Handle nesting
        if (level > currentLevel) {
            tocHTML += '<ul>'.repeat(level - currentLevel);
        } else if (level < currentLevel) {
            tocHTML += '</ul>'.repeat(currentLevel - level);
        }

        tocHTML += `<li><a href="#${id}">${text}</a></li>`;
        currentLevel = level;
    });

    // Close remaining lists
    tocHTML += '</ul>'.repeat(currentLevel - 1);
    tocContainer.innerHTML = tocHTML;

    // Add smooth scrolling to TOC links
    tocContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Update URL without scrolling
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Highlight current section in TOC
    highlightCurrentSection();
}

// Highlight current section in TOC based on scroll position
function highlightCurrentSection() {
    const tocLinks = document.querySelectorAll('#sidebar-toc a');
    const headings = document.querySelectorAll('.content h2, .content h3, .content h4');

    if (headings.length === 0) return;

    window.addEventListener('scroll', () => {
        let current = '';

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                current = heading.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    // Add hamburger button for mobile
    const header = document.querySelector('.site-header .header-content');
    if (!header) return;

    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Toggle menu');

    const sidebar = document.querySelector('.sidebar');

    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Insert at the beginning of header for mobile
    if (window.innerWidth <= 768) {
        header.insertBefore(menuButton, header.firstChild);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    generateTOC();
    initMobileMenu();

    // Auto-expand category if current page is in it
    const activeLink = document.querySelector('.category-children a.active');
    if (activeLink) {
        const categoryItem = activeLink.closest('.category-item');
        if (categoryItem) {
            const header = categoryItem.querySelector('.category-header');
            toggleCategory(header);
        }
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                initMobileMenu();
            }
        }, 250);
    });
});
