document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('solutionsList');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    const catButtons = document.querySelectorAll('.cat-btn');
    
    let allSolutions = [];
    let currentCategory = 'all';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.log);
    }

    fetch('./data/solutions.json')
        .then(res => res.json())
        .then(data => {
            allSolutions = data;
            renderSolutions(data);
        })
        .catch(err => console.error('Error cargando JSON:', err));

    searchInput.addEventListener('input', (e) => filterData(e.target.value, currentCategory));

    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-cat');
            filterData(searchInput.value, currentCategory);
        });
    });

    function filterData(searchTerm, category) {
        const term = searchTerm.toLowerCase();
        const filtered = allSolutions.filter(sol => {
            const matchText = sol.title.toLowerCase().includes(term) || sol.problem.toLowerCase().includes(term);
            let matchCat = true;
            if (category === 'favorites') matchCat = favorites.includes(sol.title);
            else if (category !== 'all') matchCat = sol.category === category;
            return matchText && matchCat;
        });
        renderSolutions(filtered);
    }

    function toggleFavorite(e, title) {
        e.stopPropagation();
        if (favorites.includes(title)) favorites = favorites.filter(t => t !== title);
        else favorites.push(title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        if (currentCategory === 'favorites') filterData(searchInput.value, 'favorites');
        else {
            const icon = e.target;
            icon.classList.toggle('is-fav');
            icon.textContent = favorites.includes(title) ? '❤️' : '🤍';
        }
    }

    function generateDots(difficulty) {
        let dotsHTML = '<div class="difficulty-dots">';
        let colorClass = difficulty === 1 ? 'easy' : (difficulty <= 3 ? 'medium' : 'hard');
        for (let i = 1; i <= 5; i++) {
            let activeClass = i <= difficulty ? `active ${colorClass}` : '';
            dotsHTML += `<div class="dot ${activeClass}"></div>`;
        }
        dotsHTML += '</div>';
        return dotsHTML;
    }

    function renderSolutions(solutions) {
        list.innerHTML = '';
        if(solutions.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:white; width:100%;">No hay resultados 🤷‍♂️</p>';
            return;
        }

        solutions.forEach(sol => {
            const card = document.createElement('div');
            const imageSrc = sol.image_url || 'https://placehold.co/100x100/e2e8f0/475569?text=Sin+Foto';
            const isFav = favorites.includes(sol.title);
            const dots = generateDots(sol.difficulty || 1);

            card.className = `solution-card`;
            card.innerHTML = `
                <div class="fav-icon ${isFav ? 'is-fav' : ''}">${isFav ? '❤️' : '🤍'}</div>
                <div class="card-image-container">
                    <img src="${imageSrc}" alt="${sol.title}" class="card-img">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${sol.title}</h3>
                    ${dots}
                </div>
            `;
            
            card.querySelector('.fav-icon').addEventListener('click', (e) => toggleFavorite(e, sol.title));
            card.addEventListener('click', (e) => {
                if(!e.target.classList.contains('fav-icon')) openModal(sol);
            });

            observer.observe(card);
            list.appendChild(card);
        });
    }

    function openModal(sol) {
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

        let buyButtonHTML = '';
        if (sol.affiliate_url_primary) {
            buyButtonHTML = `
                <a href="${sol.affiliate_url_primary}" target="_blank" class="action-btn amazon-btn">🛒 Comprar en Amazon</a>
                <p style="text-align:center; font-size:0.8rem; color:rgba(255,255,255,0.6); margin-top:8px; font-style:italic;">
                    *El truco te salva hoy, pero equípate para mañana.
                </p>
            `;
        }

        const ytUrl = sol.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(sol.title + " truco casero")}`;
        const ytButton = `<a href="${ytUrl}" target="_blank" class="action-btn video-btn">▶️ YouTube</a>`;

        const tiktokUrl = sol.tiktok_url || `https://www.tiktok.com/search?q=${encodeURIComponent(sol.title + " hack")}`;
        const tiktokButton = `<a href="${tiktokUrl}" target="_blank" class="action-btn tiktok-btn">🎵 TikTok</a>`;

        const shareText = `¡Mira este truco: ${sol.title}! 👉 https://el-apanador-jesus.onrender.com`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        const modalImageSrc = sol.image_url || 'https://placehold.co/600x300/e2e8f0/475569?text=Sin+Foto';

        let related = allSolutions.filter(s => s.category === sol.category && s.title !== sol.title);
        if (related.length < 2) {
            const randomRest = allSolutions.filter(s => s.title !== sol.title).sort(() => 0.5 - Math.random());
            related = randomRest;
        }
        related = related.slice(0, 2);

        let relatedHTML = '';
        if (related.length > 0) {
            relatedHTML = `<div class="related-section"><div class="related-title">Quizás te interese...</div><div class="related-grid">`;
            related.forEach(r => {
                const rImg = r.image_url || 'https://placehold.co/100x100';
                relatedHTML += `
                    <div class="related-card" onclick="document.dispatchEvent(new CustomEvent('openRelated', {detail: '${r.title}'}))">
                        <img src="${rImg}" class="related-img">
                        <div class="related-text">${r.title}</div>
                    </div>`;
            });
            relatedHTML += `</div></div>`;
        }

        modalBody.innerHTML = `
            <img src="${modalImageSrc}" alt="${sol.title}" class="modal-hero-img">
            <div style="padding:20px;">
                <h2 style="margin-top:0">${sol.title}</h2>
                <p style="font-size:1.1rem; line-height: 1.6; opacity: 0.9;">${sol.solution_text}</p>
                
                <div class="video-actions">
                    ${ytButton}
                    ${tiktokButton}
                </div>

                <a href="${whatsappUrl}" target="_blank" class="action-btn whatsapp-btn">📲 Compartir</a>
                
                <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin:15px 0">
                ${buyButtonHTML}
                ${relatedHTML}
            </div>
        `;
        modal.style.display = "flex";
    }

    document.addEventListener('openRelated', (e) => {
        const relatedTitle = e.detail;
        const relatedSol = allSolutions.find(s => s.title === relatedTitle);
        if(relatedSol) openModal(relatedSol);
    });
});
