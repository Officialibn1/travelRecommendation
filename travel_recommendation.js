document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const recommendationResults = document.getElementById('recommendation-results');

    const homeLink = document.getElementById('home-link');
    const aboutLink = document.getElementById('about-link');
    const contactLink = document.getElementById('contact-link');

    const homePageContent = document.getElementById('home-page-content');
    const aboutUsPageContent = document.getElementById('about-us-page-content');
    const contactUsPageContent = document.getElementById('contact-us-page-content');


    function showSection(sectionId) {
        homePageContent.style.display = 'none';
        aboutUsPageContent.style.display = 'none';
        contactUsPageContent.style.display = 'none';

        if (sectionId === 'home') {
            homePageContent.style.display = 'flex';
            document.querySelector('.search-container').style.display = 'flex';
        } else if (sectionId === 'about') {
            aboutUsPageContent.style.display = 'block';
            document.querySelector('.search-container').style.display = 'none';
        } else if (sectionId === 'contact') {
            document.querySelector('.search-container').style.display = 'none';
        }
    }

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('home');
    });

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('about');
    });

    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('contact');
    });

    showSection('home');

    async function fetchRecommendations() {
        try {
            const response = await fetch('travel_recommendation_api.json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            return null;
        }
    }

    function displayRecommendations(recommendations) {
        recommendationResults.innerHTML = ''; 

        if (!recommendations || recommendations.length === 0) {
            recommendationResults.innerHTML = '<p>No recommendations found for your search.</p>';
            return;
        }

        recommendations.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('recommendation-item');

            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.alt = item.name;
            itemDiv.appendChild(img);

            const name = document.createElement('h4');
            name.textContent = item.name;
            itemDiv.appendChild(name);

            const description = document.createElement('p');
            description.textContent = item.description;
            itemDiv.appendChild(description);

            if (item.timeZone) {
                const timeDiv = document.createElement('div');
                timeDiv.classList.add('time');
                const options = { timeZone: item.timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
                const currentTime = new Date().toLocaleTimeString('en-US', options);
                timeDiv.textContent = `Current time: ${currentTime}`;
                itemDiv.appendChild(timeDiv);
            }

            recommendationResults.appendChild(itemDiv);
        });
    }

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.toLowerCase().trim();
        const data = await fetchRecommendations();
        let filteredRecommendations = [];

        if (data) {
            if (query.includes('beach') || query.includes('beaches')) {
                filteredRecommendations = data.beaches;
            } else if (query.includes('temple') || query.includes('temples')) {
                filteredRecommendations = data.temples;
            } else {
                data.countries.forEach(country => {
                    if (country.name.toLowerCase().includes(query)) {
                        filteredRecommendations.push(...country.cities);
                    }
                    country.cities.forEach(city => {
                        if (city.name.toLowerCase().includes(query)) {
                            filteredRecommendations.push(city);
                        }
                    });
                });
            }
        }
        displayRecommendations(filteredRecommendations);
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        recommendationResults.innerHTML = '';
    });
});