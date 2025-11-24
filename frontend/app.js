document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('solutionsList');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    const catButtons = document.querySelectorAll('.cat-btn');
    
    let allSolutions = [];
    let currentCategory = 'all'; // Categoría activa

    // 1. Cargar datos
    fetch('/api/solutions')
        .then(res => res.json())
        .then(data => {
            allSolutions = data;
            renderSolutions(data);
        })
        .catch(err => console.error("Error:", err));

    // 2. Buscador (Respeta la categoría actual)
    searchInput.addEventListener('input', (e) => {
        filterData(e.target.value, currentCategory);
    });

    // 3. Filtro por Categorías
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Estilo activo
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar filtro
            currentCategory = btn.getAttribute('data-cat');
            filterData(searchInput.value, currentCategory);
        });
    });

    function filterData(searchTerm, category) {
        const term = searchTerm.toLowerCase();
        
        const filtered = allSolutions.filter(sol => {
            const matchText = sol.title.toLowerCase().includes(term) || sol.problem.toLowerCase().includes(term);
            const matchCat = category === 'all' || sol.category === category;
            return matchText && matchCat;
        });
        
        renderSolutions(filtered);
    }

    // 4. Renderizar lista (OPTIMIZADO PARA MÓVIL)
    function renderSolutions(solutions) {
        list.innerHTML = '';
        if(solutions.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#333; background:white; padding:10px; border-radius:10px;">No hay apaños para eso 🤷‍♂️</p>';
            return;
        }

        solutions.forEach(sol => {
            const card = document.createElement('div');
            const riskClass = sol.risk_level === 'Alto' ? 'risk-alto' : (sol.risk_level === 'Medio' ? 'risk-medio' : 'risk-bajo');
            const imageSrc = sol.image_url || 'https://placehold.co/100x100/e2e8f0/475569?text=Sin+Foto';

            card.className = `solution-card ${riskClass}`;
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${imageSrc}" alt="${sol.title}" class="card-img">
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px">
                        <span class="tag">${sol.category || 'Varios'}</span>
                    </div>
                    <h3 class="card-title">${sol.title}</h3>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(sol));
            list.appendChild(card);
        });
    }

    // 5. Modal Detalle
    function openModal(sol) {
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

        let buyButtonHTML = '';
        if (sol.affiliate_url_primary) {
            buyButtonHTML = `
                <a href="${sol.affiliate_url_primary}" target="_blank" class="amazon-btn">
                    🛒 Comprar en Amazon
                </a>`;
        }

        const videoUrl = sol.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(sol.title + " truco casero")}`;
        const videoButtonHTML = `<a href="${videoUrl}" target="_blank" class="video-btn">▶️ Ver Video</a>`;
        
        const modalImageSrc = sol.image_url || 'https://placehold.co/600x300/e2e8f0/475569?text=Sin+Foto';

        modalBody.innerHTML = `
            <img src="${modalImageSrc}" alt="${sol.title}" class="modal-hero-img">
            <div style="padding:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="tag">${sol.risk_level || 'Seguro'}</span>
                    <small style="color:#666">Dificultad: ${sol.difficulty}/5</small>
                </div>
                <h2 style="margin-top:10px; margin-bottom:10px;">${sol.title}</h2>
                <p style="font-size:1rem; color:#333; line-height: 1.5;">${sol.solution_text}</p>
                
                ${videoButtonHTML}
                <hr style="border:0; border-top:1px solid #eee; margin:15px 0">
                ${buyButtonHTML}
            </div>
        `;
        modal.style.display = "flex";
    }
});