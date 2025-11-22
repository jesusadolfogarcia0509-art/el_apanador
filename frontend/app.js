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

    // 3. Lógica para cerrar el Modal
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

    // 4. Función que pinta las tarjetas
    function renderSolutions(solutions) {
        list.innerHTML = '';
        if(solutions.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:#666">No hay apaños para eso 🤷‍♂️</p>';
            return;
        }

        solutions.forEach(sol => {
            const card = document.createElement('div');
            const riskClass = sol.risk_level === 'Alto' ? 'risk-alto' : (sol.risk_level === 'Medio' ? 'risk-medio' : 'risk-bajo');
            
            card.className = `solution-card ${riskClass}`;
            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                    <span class="tag">${sol.risk_level || 'Seguro'}</span>
                    <small>Dificultad: ${sol.difficulty || 1}/5</small>
                </div>
                <h3 style="margin:0 0 10px 0">${sol.title}</h3>
                <p style="color:#64748b; margin:0">${sol.problem}</p>
            `;
            
            // AL HACER CLIC: Abrimos el Modal bonito
            card.addEventListener('click', () => {
                openModal(sol);
            });

            list.appendChild(card);
        });
    }

    // 5. Función que abre el detalle y decide si mostrar el botón de Amazon
    function openModal(sol) {
        let buyButtonHTML = '';
        
        // Si el truco tiene enlace de afiliado, creamos el botón naranja
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

        modalBody.innerHTML = `
            <h2 style="margin-top:0">${sol.title}</h2>
            <p style="font-size:1.1rem; color:#333; line-height: 1.6;">${sol.solution_text}</p>
            <hr style="border:0; border-top:1px solid #eee; margin:20px 0">
            ${buyButtonHTML}
        `;
        
        modal.style.display = "flex";
    }
});