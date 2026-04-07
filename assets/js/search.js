// Generate search index and handle search functionality
(function() {
    let searchIndex;
    let searchData;
    let selectedIndex = -1;

    // Load search data (returns promise for lazy loading)
    async function loadSearchData() {
        try {
            const searchInput = document.getElementById('search-input');
            const searchDataUrl = searchInput.getAttribute('data-search-url');
            const response = await fetch(searchDataUrl);
            searchData = await response.json();

            // Build Lunr index
            searchIndex = lunr(function() {
                this.ref('url');
                this.field('title', { boost: 10 });
                this.field('content');
                this.field('description', { boost: 5 });

                searchData.forEach(function(doc) {
                    this.add(doc);
                }, this);
            });
        } catch (error) {
            console.error('Error loading search data:', error);
        }
    }

    // Get title suggestions matching the query
    function getSuggestions(query) {
        if (!searchData || !query) return [];

        const lower = query.toLowerCase();
        // Score titles by match quality
        const matches = searchData
            .map(item => {
                const title = item.title.toLowerCase();
                let score = 0;
                if (title === lower) score = 100;
                else if (title.startsWith(lower)) score = 80;
                else if (title.includes(lower)) score = 60;
                else {
                    // Check if words in the title start with the query
                    const words = title.split(/\s+/);
                    if (words.some(w => w.startsWith(lower))) score = 50;
                }
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        return matches;
    }

    // Display autocomplete suggestions
    function displaySuggestions(suggestions, query) {
        const resultsContainer = document.getElementById('search-results');

        if (suggestions.length === 0) {
            resultsContainer.classList.remove('active');
            return;
        }

        const lower = query.toLowerCase();
        const html = suggestions.map((item, i) => {
            // Highlight the matching portion of the title
            const title = item.title;
            const titleLower = title.toLowerCase();
            const matchStart = titleLower.indexOf(lower);
            let highlighted;
            if (matchStart >= 0) {
                highlighted = title.substring(0, matchStart)
                    + '<mark>' + title.substring(matchStart, matchStart + query.length) + '</mark>'
                    + title.substring(matchStart + query.length);
            } else {
                highlighted = title;
            }

            return `
                <div class="search-suggestion${i === selectedIndex ? ' selected' : ''}"
                     data-url="${item.url}" data-index="${i}">
                    <span class="search-suggestion-title">${highlighted}</span>
                    ${item.description ? `<span class="search-suggestion-desc">${item.description.substring(0, 80)}</span>` : ''}
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = html;
        resultsContainer.classList.add('active');

        // Add click handlers
        resultsContainer.querySelectorAll('.search-suggestion').forEach(el => {
            el.addEventListener('click', function() {
                window.location.href = this.dataset.url;
            });
        });
    }

    // Perform full search
    function performSearch(query) {
        if (!searchIndex || !query) return [];

        try {
            // Use wildcard for partial matching
            const results = searchIndex.search(query + '*');
            return results.map(result => {
                const item = searchData.find(d => d.url === result.ref);
                return { ...item, score: result.score };
            });
        } catch (e) {
            // Fall back to plain search if wildcard fails
            const results = searchIndex.search(query);
            return results.map(result => {
                const item = searchData.find(d => d.url === result.ref);
                return { ...item, score: result.score };
            });
        }
    }

    // Display full search results
    function displayResults(results) {
        const resultsContainer = document.getElementById('search-results');

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
            resultsContainer.classList.add('active');
            return;
        }

        const html = results.map(result => {
            const excerpt = result.content
                ? result.content.substring(0, 150) + '...'
                : result.description || '';

            return `
                <div class="search-result" onclick="window.location.href='${result.url}'">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-excerpt">${excerpt}</div>
                </div>
            `;
        }).join('');

        resultsContainer.innerHTML = html;
        resultsContainer.classList.add('active');
    }

    // Initialize search
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.getElementById('search-results');

        if (!searchInput) return;

        let searchTimeout;
        let loadingPromise = null;
        let mode = 'suggest'; // 'suggest' or 'results'

        // Lazy load search data on first focus
        searchInput.addEventListener('focus', function() {
            if (!loadingPromise) {
                loadingPromise = loadSearchData();
            }
        }, { once: true });

        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            selectedIndex = -1;
            mode = 'suggest';

            if (query.length < 1) {
                resultsContainer.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(async () => {
                if (loadingPromise) await loadingPromise;

                // Show title suggestions for short queries
                const suggestions = getSuggestions(query);
                if (suggestions.length > 0) {
                    displaySuggestions(suggestions, query);
                } else if (query.length >= 2) {
                    // Fall back to full-text search via lunr
                    mode = 'results';
                    const results = performSearch(query);
                    displayResults(results);
                } else {
                    resultsContainer.classList.remove('active');
                }
            }, 150); // Faster debounce for suggestions
        });

        // Keyboard navigation
        searchInput.addEventListener('keydown', function(e) {
            const items = resultsContainer.querySelectorAll('.search-suggestion, .search-result');
            if (!items.length) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelection(items);
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    e.preventDefault();
                    const url = items[selectedIndex].dataset.url || items[selectedIndex].getAttribute('onclick');
                    if (items[selectedIndex].dataset.url) {
                        window.location.href = items[selectedIndex].dataset.url;
                    } else {
                        items[selectedIndex].click();
                    }
                } else if (e.target.value.trim().length >= 2) {
                    // Enter with no selection: run full search
                    e.preventDefault();
                    clearTimeout(searchTimeout);
                    (async () => {
                        if (loadingPromise) await loadingPromise;
                        mode = 'results';
                        selectedIndex = -1;
                        const results = performSearch(e.target.value.trim());
                        displayResults(results);
                    })();
                }
            } else if (e.key === 'Escape') {
                resultsContainer.classList.remove('active');
                searchInput.blur();
            }
        });

        function updateSelection(items) {
            items.forEach((item, i) => {
                item.classList.toggle('selected', i === selectedIndex);
            });
            // Scroll selected item into view
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].scrollIntoView({ block: 'nearest' });
            }
        }

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.classList.remove('active');
            }
        });
    }

    // Init search when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
