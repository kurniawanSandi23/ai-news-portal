document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('newsContainer');
    const searchInput = document.getElementById('searchInput');
    let allArticles = [];

    const NEWSAPI_KEY = '43dd713afa4f41d7b77ece2ab12802e3';
    const GNEWS_KEY = 'b4511f6a1ecefa4e121a2314d2ba1125';
    const CURRENTS_KEY = 'QZBhjCQgKqGHWk1vUyrW8JPZaFdUTlfUmIOHBXyeKVXyLNy';

    const newsApiUrl = `https://newsapi.org/v2/everything?q=artificial+intelligence&sortBy=publishedAt&apiKey=${NEWSAPI_KEY}&language=en&pageSize=10`;
    const gnewsUrl = `https://gnews.io/api/v4/search?q=AI&lang=en&max=10&token=${GNEWS_KEY}`;
    const currentsUrl = `https://api.currentsapi.services/v1/search?keywords=AI&language=en&apiKey=${CURRENTS_KEY}`;

    async function fetchNews(url, source) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            let articles = [];
            if (source === 'newsapi') {
                articles = data.articles.map(article => ({
                    title: article.title,
                    url: article.url,
                    publishedAt: article.publishedAt
                }));
            } else if (source === 'gnews') {
                articles = data.articles.map(article => ({
                    title: article.title,
                    url: article.url,
                    publishedAt: article.published
                }));
            } else if (source === 'currents') {
                articles = data.news.map(article => ({
                    title: article.title,
                    url: article.url,
                    publishedAt: article.published
                }));
            }
            return articles;
        } catch (error) {
            console.error(`Gagal mengambil dari ${source}:`, error);
            return [];
        }
    }

    async function loadNews() {
        const [newsapiArticles, gnewsArticles, currentsArticles] = await Promise.all([
            fetchNews(newsApiUrl, 'newsapi'),
            fetchNews(gnewsUrl, 'gnews'),
            fetchNews(currentsUrl, 'currents')
        ]);

        allArticles = [...newsapiArticles, ...gnewsArticles, ...currentsArticles]
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        displayNews(allArticles);
    }

    function displayNews(articles) {
        newsContainer.innerHTML = '';
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                <p>Diterbitkan: ${new Date(article.publishedAt).toLocaleString()}</p>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.toLowerCase();
        const filtered = allArticles.filter(article => article.title.toLowerCase().includes(keyword));
        displayNews(filtered);
    });

    function createCodeAnimation() {
        const codeBg = document.querySelector('.code-bg');
        for (let i = 0; i < 100; i++) {
            const span = document.createElement('span');
            const text = generateRandomCode(10);
            span.textContent = text;
            span.style.left = Math.random() * 100 + 'vw';
            span.style.animationDuration = Math.random() * 3 + 2 + 's';
            span.style.animationDelay = Math.random() * 5 + 's';
            codeBg.appendChild(span);
        }
    }

    function generateRandomCode(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    window.addEventListener('load', createCodeAnimation);

    loadNews();
});