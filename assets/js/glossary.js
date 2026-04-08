---
---
// Glossary auto-linking functionality
(function() {
    const glossaryTerms = [
        {% for item in site.data.glossary %}
        {
            term: {{ item.term | jsonify }},
            full: {{ item.full | default: "" | jsonify }},
            definition: {{ item.definition | jsonify }},
            slug: {{ item.term | slugify | jsonify }},
            alternates: {{ item.alternates | default: array | jsonify }}
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    ];

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function markdownToHtml(text) {
        // Convert basic markdown formatting to HTML
        // Links: [text](url) - show as underlined text in tooltip (not clickable)
        text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<u>$1</u>');
        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        return text;
    }

    function initGlossary() {
        // Only run on content pages, not on the glossary page itself
        const content = document.querySelector('.content');
        const isGlossaryPage = window.location.pathname.includes('/glossary');

        if (!content || isGlossaryPage) return;

        // Track which terms we've already linked (first occurrence only)
        const linkedTerms = new Set();

        // Sort terms by length (longest first) to match multi-word phrases before single words
        const sortedTerms = glossaryTerms.sort((a, b) => b.term.length - a.term.length);

        // Build a flat list of all terms to search for (main term + alternates)
        const termsToSearch = [];
        sortedTerms.forEach(glossaryItem => {
            // Add main term
            termsToSearch.push({
                searchTerm: glossaryItem.term,
                glossaryItem: glossaryItem
            });
            // Add alternates if they exist
            if (glossaryItem.alternates && Array.isArray(glossaryItem.alternates)) {
                glossaryItem.alternates.forEach(alt => {
                    termsToSearch.push({
                        searchTerm: alt,
                        glossaryItem: glossaryItem
                    });
                });
            }
        });

        // Sort by length (longest first)
        termsToSearch.sort((a, b) => b.searchTerm.length - a.searchTerm.length);

        // Get all text nodes in the content
        const walker = document.createTreeWalker(
            content,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip if parent is already a glossary term, code block, or heading
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;

                    const tagName = parent.tagName.toLowerCase();
                    if (tagName === 'code' ||
                        tagName === 'pre' ||
                        tagName === 'a' ||
                        tagName === 'h1' ||
                        parent.classList.contains('glossary-term')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Process each text node
        textNodes.forEach(textNode => {
            let text = textNode.textContent;

            // Find all matches in this text node
            const allMatches = [];

            termsToSearch.forEach(termObj => {
                const glossaryItem = termObj.glossaryItem;
                const searchTerm = termObj.searchTerm;

                // Create case-insensitive regex with word boundaries
                const regex = new RegExp('\\b' + escapeRegex(searchTerm) + '\\b', 'i');
                const match = text.match(regex);

                if (match && match.index !== undefined) {
                    allMatches.push({
                        index: match.index,
                        matchedText: match[0],
                        length: match[0].length,
                        glossaryItem: glossaryItem,
                        searchTerm: searchTerm
                    });
                }
            });

            // Sort matches by position (earliest first), then longest first for ties
            allMatches.sort((a, b) => a.index - b.index || b.length - a.length);

            // Process matches in order, skipping duplicates of same glossary item
            let modified = false;
            let fragments = [];
            let lastIndex = 0;

            allMatches.forEach(match => {
                // Skip if we've already linked this glossary entry
                if (linkedTerms.has(match.glossaryItem.term)) return;

                // Skip if this match overlaps with a previously processed match
                if (match.index < lastIndex) return;

                // Add text before match
                if (match.index > lastIndex) {
                    fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
                }

                // Create glossary term element
                const termSpan = document.createElement('span');
                termSpan.className = 'glossary-term';
                termSpan.textContent = match.matchedText; // Preserve original case

                // Create tooltip
                const tooltip = document.createElement('span');
                tooltip.className = 'glossary-tooltip';

                let tooltipText = '';
                if (match.glossaryItem.full) {
                    tooltipText = `<strong>${markdownToHtml(match.glossaryItem.full)}</strong><br>`;
                }
                tooltipText += markdownToHtml(match.glossaryItem.definition);
                tooltip.innerHTML = tooltipText;

                termSpan.appendChild(tooltip);

                // Make it a link to the glossary page
                const link = document.createElement('a');
                link.href = `{{ '/glossary/' | relative_url }}#${match.glossaryItem.slug}`;
                link.className = 'glossary-link';
                link.appendChild(termSpan);

                // Toggle tooltip on click/tap for touch devices
                termSpan.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = this.classList.contains('glossary-active');
                    // Close any other open tooltips
                    document.querySelectorAll('.glossary-term.glossary-active').forEach(el => {
                        el.classList.remove('glossary-active');
                    });
                    if (!isActive) {
                        this.classList.add('glossary-active');
                    }
                });

                fragments.push(link);

                lastIndex = match.index + match.length;
                modified = true;
                linkedTerms.add(match.glossaryItem.term);
            });

            if (modified) {
                // Add remaining text
                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }

                // Replace the text node with our fragments
                const parent = textNode.parentNode;
                fragments.forEach(fragment => {
                    parent.insertBefore(fragment, textNode);
                });
                parent.removeChild(textNode);
            }
        });
    }

    // Dismiss tooltips when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.glossary-term')) {
            document.querySelectorAll('.glossary-term.glossary-active').forEach(el => {
                el.classList.remove('glossary-active');
            });
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlossary);
    } else {
        initGlossary();
    }
})();
