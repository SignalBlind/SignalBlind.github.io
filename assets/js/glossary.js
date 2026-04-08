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
            page: {{ item.page | default: "" | jsonify }},
            alternates: {{ item.alternates | default: array | jsonify }}
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    ];

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return match ? match[1] : null;
    }

    function setCookie(name, value) {
        document.cookie = name + '=' + value + ';path=/;max-age=31536000;SameSite=Lax';
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function markdownToHtml(text) {
        // Convert basic markdown formatting to HTML
        // Extract links first to protect URLs from italic/bold processing
        var links = [];
        text = text.replace(/\[([^\]]+)\]\(((?:[^()]*|\([^()]*\))*)\)/g, function(match, linkText, url) {
            var placeholder = '\x00LINK' + links.length + '\x00';
            links.push('<a href="' + url + '" class="glossary-tooltip-link" style="display:inline;margin:0;font-size:inherit;">' + linkText + '</a>');
            return placeholder;
        });
        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');
        // Restore links
        links.forEach(function(link, i) {
            text = text.replace('\x00LINK' + i + '\x00', link);
        });
        return text;
    }

    function linkAllOccurrences() {
        return getCookie('glossary_all') === '1';
    }

    function initGlossary() {
        // Only run on content pages, not on the glossary page itself
        const content = document.querySelector('.content');
        const isGlossaryPage = window.location.pathname.includes('/glossary');

        if (!content || isGlossaryPage) return;

        // Remove any existing glossary markup (for re-init on toggle)
        content.querySelectorAll('.glossary-link').forEach(wrapper => {
            const termSpan = wrapper.querySelector('.glossary-term');
            if (termSpan) {
                const text = document.createTextNode(termSpan.firstChild.textContent);
                wrapper.parentNode.replaceChild(text, wrapper);
            }
        });
        // Remove glossary annotations from existing links
        content.querySelectorAll('a.glossary-annotated').forEach(link => {
            link.classList.remove('glossary-annotated', 'glossary-term', 'glossary-active');
            link.style.removeProperty('position');
            const tooltip = link.querySelector('.glossary-tooltip');
            if (tooltip) tooltip.remove();
            link.removeEventListener('click', link._glossaryClickHandler);
        });
        // Merge adjacent text nodes after removing markup
        content.normalize();

        const allMode = linkAllOccurrences();

        // Track which terms we've already linked (first occurrence only when not in all mode)
        const linkedTerms = new Set();

        // Sort terms by length (longest first) to match multi-word phrases before single words
        const sortedTerms = [...glossaryTerms].sort((a, b) => b.term.length - a.term.length);

        // Build a flat list of all terms to search for (main term + alternates)
        const termsToSearch = [];
        sortedTerms.forEach(glossaryItem => {
            termsToSearch.push({
                searchTerm: glossaryItem.term,
                glossaryItem: glossaryItem
            });
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
        function collectTextNodes() {
            const walker = document.createTreeWalker(
                content,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
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

            const nodes = [];
            let node;
            while (node = walker.nextNode()) {
                nodes.push(node);
            }
            return nodes;
        }

        const textNodes = collectTextNodes();

        // Process each text node
        textNodes.forEach(textNode => {
            let text = textNode.textContent;

            // Find all matches in this text node
            const allMatches = [];

            termsToSearch.forEach(termObj => {
                const glossaryItem = termObj.glossaryItem;
                const searchTerm = termObj.searchTerm;

                if (allMode) {
                    // Find all occurrences
                    const regex = new RegExp('\\b' + escapeRegex(searchTerm) + '\\b', 'gi');
                    let m;
                    while ((m = regex.exec(text)) !== null) {
                        allMatches.push({
                            index: m.index,
                            matchedText: m[0],
                            length: m[0].length,
                            glossaryItem: glossaryItem,
                            searchTerm: searchTerm
                        });
                    }
                } else {
                    // First occurrence only
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
                }
            });

            // Sort matches by position (earliest first), then longest first for ties
            allMatches.sort((a, b) => a.index - b.index || b.length - a.length);

            // Process matches in order
            let modified = false;
            let fragments = [];
            let lastIndex = 0;

            allMatches.forEach(match => {
                // In first-only mode, skip if we've already linked this glossary entry
                if (!allMode && linkedTerms.has(match.glossaryItem.term)) return;

                // Skip if this match overlaps with a previously processed match
                if (match.index < lastIndex) return;

                // Add text before match
                if (match.index > lastIndex) {
                    fragments.push(document.createTextNode(text.substring(lastIndex, match.index)));
                }

                // Create glossary term element
                const termSpan = document.createElement('span');
                termSpan.className = 'glossary-term';
                termSpan.textContent = match.matchedText;

                // Create tooltip
                const tooltip = document.createElement('span');
                tooltip.className = 'glossary-tooltip';

                let tooltipText = '';
                if (match.glossaryItem.full) {
                    tooltipText = `<strong>${markdownToHtml(match.glossaryItem.full)}</strong><br>`;
                }
                tooltipText += markdownToHtml(match.glossaryItem.definition);

                // Add "Read more" link inside tooltip
                const linkTarget = match.glossaryItem.page || `{{ '/glossary/' | relative_url }}#${match.glossaryItem.slug}`;
                const linkLabel = match.glossaryItem.page ? 'Read more \u2192' : 'Glossary \u2192';
                tooltipText += `<a href="${linkTarget}" class="glossary-tooltip-link">${linkLabel}</a>`;

                tooltip.innerHTML = tooltipText;

                termSpan.appendChild(tooltip);

                // Wrap in a span (not a link) to avoid nested <a> issues
                const wrapper = document.createElement('span');
                wrapper.className = 'glossary-link';
                wrapper.appendChild(termSpan);

                // Toggle tooltip on click/tap for touch devices
                termSpan.addEventListener('click', function(e) {
                    // Let clicks on tooltip links navigate normally
                    if (e.target.closest('.glossary-tooltip-link')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = this.classList.contains('glossary-active');
                    document.querySelectorAll('.glossary-term.glossary-active').forEach(el => {
                        el.classList.remove('glossary-active');
                    });
                    if (!isActive) {
                        this.classList.add('glossary-active');
                    }
                });

                fragments.push(wrapper);

                lastIndex = match.index + match.length;
                modified = true;
                linkedTerms.add(match.glossaryItem.term);
            });

            if (modified) {
                if (lastIndex < text.length) {
                    fragments.push(document.createTextNode(text.substring(lastIndex)));
                }

                const parent = textNode.parentNode;
                fragments.forEach(fragment => {
                    parent.insertBefore(fragment, textNode);
                });
                parent.removeChild(textNode);
            }
        });

        // Second pass: annotate existing <a> tags whose text matches glossary terms
        content.querySelectorAll('a:not(.glossary-tooltip-link):not(.glossary-annotated)').forEach(link => {
            const linkText = link.textContent.trim();

            for (const termObj of termsToSearch) {
                const regex = new RegExp('^' + escapeRegex(termObj.searchTerm) + '$', 'i');
                if (!regex.test(linkText)) continue;

                // In first-only mode, skip if already linked
                if (!allMode && linkedTerms.has(termObj.glossaryItem.term)) continue;

                const glossaryItem = termObj.glossaryItem;

                // Add tooltip directly inside the <a> tag
                const tooltip = document.createElement('span');
                tooltip.className = 'glossary-tooltip';

                let tooltipText = '';
                if (glossaryItem.full) {
                    tooltipText = `<strong>${markdownToHtml(glossaryItem.full)}</strong><br>`;
                }
                tooltipText += markdownToHtml(glossaryItem.definition);

                const linkTarget = glossaryItem.page || `{{ '/glossary/' | relative_url }}#${glossaryItem.slug}`;
                const linkLabel = glossaryItem.page ? 'Read more \u2192' : 'Glossary \u2192';
                tooltipText += `<a href="${linkTarget}" class="glossary-tooltip-link">${linkLabel}</a>`;

                tooltip.innerHTML = tooltipText;

                link.appendChild(tooltip);
                link.classList.add('glossary-annotated', 'glossary-term');
                link.style.position = 'relative';

                // Toggle tooltip on click/tap
                link._glossaryClickHandler = function(e) {
                    if (e.target.closest('.glossary-tooltip-link')) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const isActive = this.classList.contains('glossary-active');
                    document.querySelectorAll('.glossary-term.glossary-active').forEach(el => {
                        el.classList.remove('glossary-active');
                    });
                    if (!isActive) {
                        this.classList.add('glossary-active');
                    }
                };
                link.addEventListener('click', link._glossaryClickHandler);

                linkedTerms.add(glossaryItem.term);
                break;
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

    // Wire up the toggle checkbox
    function initToggle() {
        const toggle = document.getElementById('glossary-all-toggle');
        if (!toggle) return;

        toggle.checked = linkAllOccurrences();

        toggle.addEventListener('change', function() {
            setCookie('glossary_all', this.checked ? '1' : '0');
            initGlossary();
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initToggle();
            initGlossary();
        });
    } else {
        initToggle();
        initGlossary();
    }
})();
