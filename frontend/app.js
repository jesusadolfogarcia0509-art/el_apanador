document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('solutionsList');
    const searchInput = document.getElementById('searchInput');
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    
    let allSolutions = [];

    // 1. Cargar datos del servidor
    fetch('/api/solutions')
        .then(res => res.json())
        .then(data => {
            allSolutions = data;
            renderSolutions(data);
        })
        .catch(err => console.error("Error:", err));

    // 2. Buscador
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allSolutions.filter(sol => 
            sol.title.toLowerCase().includes(term) || 
            sol.problem.toLowerCase().includes(term)
        );
        renderSolutions(filtered);
    });

    // 3. Cerrar modal
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

    // 4. Renderizar lista (AHORA CON IMAGEN)
    function renderSolutions(solutions) {
        list.innerHTML = '';
        if(solutions.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#666">No hay apaños para eso 🤷‍♂️</p>';
            return;
        }

        solutions.forEach(sol => {
            const card = document.createElement('div');
            const riskClass = sol.risk_level === 'Alto' ? 'risk-alto' : (sol.risk_level === 'Medio' ? 'risk-medio' : 'risk-bajo');
            
            // Usamos imagen placeholder si no hay imagen definida
            const imageSrc = sol.image_url || 'https://placehold.co/100x100/e2e8f0/475569?text=Sin+Foto';

            card.className = `solution-card ${riskClass}`;
            // Nueva estructura de tarjeta: Imagen a la izquierda, texto a la derecha
            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${imageSrc}" alt="${sol.title}" class="card-img">
                </div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px">
                        <span class="tag">${sol.risk_level || 'Seguro'}</span>
                        <small>Dificultad: ${sol.difficulty || 1}/5</small>
                    </div>
                    <h3 style="margin:0 0 5px 0; font-size: 1.1rem;">${sol.title}</h3>
                    <p style="color:#64748b; margin:0; font-size: 0.9rem;">${sol.problem}</p>
                </div>
            `;
            
            card.addEventListener('click', () => {
                openModal(sol);
            });

            list.appendChild(card);
        });
    }

    // 5. Abrir Modal (AHORA CON IMAGEN GRANDE)
    function openModal(sol) {
        let buyButtonHTML = '';
        let videoButtonHTML = '';
        
        // A) Botón Amazon
        if (sol.affiliate_url_primary) {
            buyButtonHTML = `
                <a href="${sol.affiliate_url_primary}" target="_blank" class="amazon-btn">
                    🛒 Comprar herramienta en Amazon
                </a>
                <p style="text-align:center; font-size:0.8rem; color:#999; margin-top:5px">
                    *El truco te salva hoy, pero equípate para mañana.
                </p>
            `;
        }

        // B) Botón Video
        const videoUrl = sol.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(sol.title + " truco casero")}`;
        videoButtonHTML = `
            <a href="${videoUrl}" target="_blank" class="video-btn">
                ▶️ Ver Tutorial en YouTube
            </a>
        `;

        // C) Imagen de Cabecera del Modal
        const modalImageSrc = sol.image_url || 'https://placehold.co/600x300/e2e8f0/475569?text=Sin+Foto';
        const modalImageHTML = `<img src="${modalImageSrc}" alt="${sol.title}" class="modal-hero-img">`;


        modalBody.innerHTML = `
            ${modalImageHTML}
            <h2 style="margin-top:15px">${sol.title}</h2>
            <p style="font-size:1.1rem; color:#333; line-height: 1.6;">${sol.solution_text}</p>
            
            ${videoButtonHTML}
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0">
            ${buyButtonHTML}
        `;
        
        modal.style.display = "flex";
    }
});