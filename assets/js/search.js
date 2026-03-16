// Generate search index and handle search functionality
(function() {
    let searchIndex;
    let searchData;

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

    // Perform search
    function performSearch(query) {
        if (!searchIndex || !query) return [];

        const results = searchIndex.search(query);
        return results.map(result => {
            const item = searchData.find(d => d.url === result.ref);
            return {
                ...item,
                score: result.score
            };
        });
    }

    // Display search results
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

        // Lazy load search data on first focus
        searchInput.addEventListener('focus', function() {
            if (!loadingPromise) {
                loadingPromise = loadSearchData();
            }
        }, { once: true });

        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 2) {
                resultsContainer.classList.remove('active');
                return;
            }

            searchTimeout = setTimeout(async () => {
                if (loadingPromise) await loadingPromise;
                const results = performSearch(query);
                displayResults(results);
            }, 300);
        });

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
