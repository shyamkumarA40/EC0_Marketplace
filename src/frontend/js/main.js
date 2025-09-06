document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.querySelector('[data-navbar]');
    if (navbarContainer) {
        renderNavbar(navbarContainer);
    }
});

function renderNavbar(container) {
    const isLoggedIn = auth.isLoggedIn();
    const logoPath = '../assets/logo.svg';

    const cartIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`;
    const userIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;

    let userAction = isLoggedIn 
        ? `<a href="./SellerDashboard.html" title="My Account" class="p-2 rounded-full hover:bg-gray-100">${userIcon}</a>`
        : `<a href="./login.html" title="Login / Sign Up" class="p-2 rounded-full hover:bg-gray-100">${userIcon}</a>`;

    if (isLoggedIn) {
        userAction += `<a href="#" id="logoutBtn" title="Logout" class="p-2 rounded-full hover:bg-gray-100 text-red-500"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></a>`;
    }

    container.innerHTML = `
        <header class="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <div class="container mx-auto px-4">
                <nav class="flex justify-between items-center py-3 relative">
                    <!-- Left Nav -->
                    <div class="hidden md:flex items-center space-x-6">
                        <a href="#" class="text-gray-600 font-semibold hover:text-green-600">Apparel</a>
                        <a href="#" class="text-gray-600 font-semibold hover:text-green-600">Furniture</a>
                        <a href="#" class="text-gray-600 font-semibold hover:text-green-600">Books</a>
                    </div>
                    
                    <!-- Centered Logo -->
                    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <a href="./index.html" class="flex items-center space-x-2">
                            <img src="${logoPath}" alt="EcoFinds Logo" class="h-8 w-8">
                            <span class="text-2xl font-bold text-green-600 hidden sm:inline-block">EcoFinds</span>
                        </a>
                    </div>

                    <!-- Right Icons -->
                    <div class="flex items-center space-x-2 ml-auto">
                        <!-- UPDATED: Search Form with Live Results Dropdown -->
                        <div class="relative hidden lg:block" id="searchContainer">
                            <form id="searchForm">
                                <input type="search" id="searchInput" name="q" placeholder="Search..." class="w-48 py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 focus:w-64">
                                <button type="submit" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                </button>
                            </form>
                            <div id="searchResults" class="absolute mt-2 w-80 bg-white border rounded-lg shadow-xl hidden overflow-hidden">
                                <!-- Live search results will appear here -->
                            </div>
                        </div>
                        ${userAction}
                        <a href="./cart.html" title="Your Cart" class="p-2 rounded-full hover:bg-gray-100">
                            ${cartIcon}
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    `;

    // --- NEW LIVE SEARCH LOGIC ---
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchContainer = document.getElementById('searchContainer');
    let debounceTimer;

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const query = searchInput.value.trim();
            if (query.length > 1) {
                debounceTimer = setTimeout(() => {
                    fetchSearchResults(query);
                }, 300); // Debounce to avoid excessive API calls
            } else {
                searchResults.classList.add('hidden');
            }
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }

    async function fetchSearchResults(query) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/search?q=${encodeURIComponent(query)}`);
            const products = await response.json();
            displaySearchResults(products);
        } catch (error) {
            console.error('Live search error:', error);
        }
    }

    function displaySearchResults(products) {
        searchResults.innerHTML = '';
        if (products.length === 0) {
            searchResults.innerHTML = '<p class="p-4 text-sm text-gray-500">No results found.</p>';
        } else {
            // Show top 5 results
            products.slice(0, 5).forEach(product => {
                searchResults.innerHTML += `
                    <a href="./product.html?id=${product.id}" class="flex items-center p-3 hover:bg-gray-100 border-b last:border-b-0">
                        <img src="${product.image_url}" class="w-12 h-12 object-cover rounded-md">
                        <div class="ml-4">
                            <p class="font-semibold text-gray-800">${product.title}</p>
                            <p class="text-sm text-green-600 font-bold">$${Number(product.price).toFixed(2)}</p>
                        </div>
                    </a>
                `;
            });
        }
        searchResults.classList.remove('hidden');
    }
    
    // --- Existing Logout and Search Form Submission Logic ---
    if (isLoggedIn) {
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });
    }

    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = e.target.q.value.trim();
            if (searchTerm) {
                window.location.href = `./search.html?q=${encodeURIComponent(searchTerm)}`;
            }
        });
    }
}

