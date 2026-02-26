---
---
// Auto-link hashtags to tag pages
(function() {
    function initHashtagLinks() {
        const content = document.querySelector('.content');
        if (!content) return;

        // Don't run on tag pages themselves
        if (window.location.pathname.includes('/tags/')) return;

        // Get all text nodes
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
                        parent.classList.contains('hashtag')) {
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

            // Find all hashtags (case-insensitive word boundaries)
            // Match #word but not ##heading or #123
            const regex = /(?:^|\s)(#([a-zA-Z][a-zA-Z0-9_-]*))/g;
            const matches = [];
            let match;

            while ((match = regex.exec(text)) !== null) {
                matches.push({
                    fullMatch: match[1],  // includes the #
                    tag: match[2],        // just the tag name
                    index: match.index + match[0].indexOf('#')
                });
            }

            if (matches.length === 0) return;

            // Build fragments
            let fragments = [];
            let lastIndex = 0;

            matches.forEach(m => {
                // Add text before match
                if (m.index > lastIndex) {
                    fragments.push(document.createTextNode(text.substring(lastIndex, m.index)));
                }

                // Create hashtag link
                const link = document.createElement('a');
                link.href = `{{ '/tags/' | relative_url }}${m.tag}/`;
                link.className = 'hashtag';
                link.textContent = m.fullMatch;

                fragments.push(link);

                lastIndex = m.index + m.fullMatch.length;
            });

            // Add remaining text
            if (lastIndex < text.length) {
                fragments.push(document.createTextNode(text.substring(lastIndex)));
            }

            // Replace the text node with fragments
            const parent = textNode.parentNode;
            fragments.forEach(fragment => {
                parent.insertBefore(fragment, textNode);
            });
            parent.removeChild(textNode);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHashtagLinks);
    } else {
        initHashtagLinks();
    }
})();
