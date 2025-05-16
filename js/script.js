document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle (Desktop and Mobile)
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark');
    }

    themeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    themeToggleMobile?.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
    });

    // Search Toggle (Mobile/Tablet)
    const searchToggle = document.getElementById('searchToggle');
    const searchForm = document.getElementById('searchForm');

    searchToggle?.addEventListener('click', () => {
        searchForm.classList.toggle('active');
        if (searchForm.classList.contains('active')) {
            document.getElementById('search-bar').focus();
        }
    });

    // Contact Form
    document.getElementById('contactForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });

    // Scroll to Top
    const scrollToTop = document.getElementById('scrollToTop');
    window.addEventListener('scroll', () => {
        scrollToTop.classList.toggle('show', window.scrollY > 200);
    });

    scrollToTop?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Filter Functionality (Dropdown)
    const filterOptions = document.querySelectorAll('.filter-option');
    const filterDropdownButton = document.getElementById('filterDropdown');
    let activeFilter = 'all';

    filterOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            filterOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            activeFilter = option.dataset.filter;

            filterDropdownButton.textContent = option.textContent;

            const posts = document.querySelectorAll('.post-card');
            posts.forEach(post => {
                post.style.display = (activeFilter === 'all' || post.dataset.category === activeFilter) ? 'block' : 'none';
            });

            const searchQuery = document.getElementById('search-bar').value;
            if (searchQuery) {
                filterPosts(searchQuery);
            }
        });

        if (option.dataset.filter === 'all') {
            option.classList.add('active');
            filterDropdownButton.textContent = option.textContent;
        }
    });

    // Debounce Function for Search
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    }

    // Search Functionality
    const searchInput = document.getElementById('search-bar');
    const searchSuggestions = document.getElementById('search-suggestions');

    function filterPosts(query) {
        query = query.toLowerCase().trim();
        const posts = document.querySelectorAll('.post-card');
        const suggestions = [];

        posts.forEach(post => {
            const title = post.querySelector('.post-title').textContent.toLowerCase();
            const description = post.querySelector('.post-description').textContent.toLowerCase();
            const category = post.dataset.category;
            const matchesQuery = title.includes(query) || description.includes(query);
            const matchesFilter = activeFilter === 'all' || category === activeFilter;

            if (matchesQuery && matchesFilter) {
                post.style.display = 'block';
                if (query && suggestions.length < 5) {
                    suggestions.push(title);
                }
            } else {
                post.style.display = 'none';
            }
        });

        searchSuggestions.innerHTML = '';
        if (query && suggestions.length > 0) {
            suggestions.forEach(suggestion => {
                const item = document.createElement('a');
                item.href = '#';
                item.className = 'list-group-item list-group-item-action';
                item.textContent = suggestion;
                searchSuggestions.appendChild(item);
            });
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    }

    searchInput.addEventListener('input', debounce(function() {
        filterPosts(this.value);
    }, 300));

    searchSuggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('list-group-item')) {
            e.preventDefault();
            searchInput.value = e.target.textContent;
            filterPosts(e.target.textContent);
            searchSuggestions.style.display = 'none';
            searchForm.classList.remove('active');
        }
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target) && !searchToggle?.contains(e.target)) {
            searchSuggestions.style.display = 'none';
            searchForm.classList.remove('active');
        }
    });

    // Share Button Functionality
    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const shareOptions = button.nextElementSibling;
            if (!shareOptions || !shareOptions.classList.contains('share-options')) {
                console.error('Share options not found for button:', button);
                return;
            }
            const postTitle = button.dataset.postTitle;
            if (!postTitle) {
                console.error('Post title not found for button:', button);
                return;
            }
            const pageUrl = window.location.href;

            document.querySelectorAll('.share-options').forEach(opt => {
                if (opt !== shareOptions) {
                    opt.classList.remove('active');
                    opt.style.display = 'none';
                }
            });

            shareOptions.classList.toggle('active');
            shareOptions.style.display = shareOptions.classList.contains('active') ? 'flex' : 'none';

            const encodedTitle = encodeURIComponent(postTitle);
            const encodedUrl = encodeURIComponent(pageUrl);
            const twitterLink = shareOptions.querySelector('.twitter-share');
            const facebookLink = shareOptions.querySelector('.facebook-share');
            const linkedinLink = shareOptions.querySelector('.linkedin-share');
            if (twitterLink) twitterLink.href = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
            if (facebookLink) facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            if (linkedinLink) facebookLink.href = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
        });
    });

    document.querySelectorAll('.close-share').forEach(button => {
        button.addEventListener('click', () => {
            const shareOptions = button.closest('.share-options');
            shareOptions.classList.remove('active');
            shareOptions.style.display = 'none';
        });
    });
});