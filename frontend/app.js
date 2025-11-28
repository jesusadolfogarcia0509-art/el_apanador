document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('solutionsList');
    const searchInput = document.getElementById('searchInput');
    const lensBtn = document.getElementById('lensBtn');
    const cameraInput = document.getElementById('cameraInput');
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.querySelector('.close-btn');
    const catButtons = Array.from(document.querySelectorAll('.cat-btn'));
    const diffButtons = Array.from(document.querySelectorAll('.diff-btn'));
    
    let allSolutions = [];
    let currentCategory = 'all';
    let currentDifficulty = 'all';
    let currentCatIndex = 0;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const ICONS = {
        amazon: '<svg viewBox="0 0 24 24"><path d="M15.93 17.09c-2.43 1.32-5.13 1.78-7.96.93.91-.62 1.73-1.33 2.2-2.63 2.6.9 5.27.56 5.76-.3 2.73-4.79-4.98-6.08-6.48-3.08-4.31-1.07-4.25 3.73-.53 4.59-.26 1.35-.37 2.85-1.72 2.72-.72-.07-1.4-.46-1.72-1.23-.23-.55-.16-1.22.15-1.68.49-.76 1.46-.83 2.24-.59.12.04.23-.12.17-.22-.46-.82-1.66-1.1-2.54-.71-1.04.46-1.53 1.73-1.21 2.79.29.96 1.12 1.64 2.07 1.91 1.59.46 3.34-.02 4.62-1.07.24.37.49.73.79 1.05.66.71 1.68 1.01 2.62.92 1.22-.11 2.37-.65 3.33-1.43-.12-.16-.24-.31-.36-.47zM9.5 9.82c1.5-.53 3.63.37 2.54 2.74-1.37.1-2.54-.65-2.54-2.74z"/></svg>',
        aliexpress: '<svg viewBox="0 0 24 24"><path d="M3.8 13.2h3.4c.2 0 .4-.1.5-.3l.7-3.2c.1-.4.4-.6.8-.6h1.7c.2 0 .4.2.4.4v.3c0 .2-.1.3-.2.4l-2.2 8.3c-.1.4.2.8.6.8h1.8c.4 0 .7-.3.8-.6l1.3-5.2c.1-.4.4-.6.8-.6h1.6c.2 0 .4.2.4.4 0 .1-.1.3-.1.3l-2.2 8.4c-.1.4.2.8.6.8h1.8c.4 0 .7-.3.8-.6l1.4-5.3c.1-.4.4-.6.8-.6h1.6c.4 0 .7.3.6.7l-2.1 7.9c-.2.8-1 1.4-1.9 1.4H9c-1.7 0-3.1-1.3-3.5-3l-1-3.8c-.1-.4-.4-.6-.8-.6H3c-.2 0-.4-.2-.4-.4v-1c0-.3.2-.5.4-.5h.8z"/></svg>',
        youtube: '<svg viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
        tiktok: '<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
        whatsapp: '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>'
    };

    // --- LÓGICA RODILLO ---
    window.moveRoller = function(id, direction, totalItems) {
        const track = document.getElementById(`track-${id}`);
        let currentIndex = parseInt(track.getAttribute('data-index') || 0);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = totalItems - 1;
        if (newIndex >= totalItems) newIndex = 0;
        
        track.style.transform = `translateY(-${newIndex * 80}px)`;
        track.setAttribute('data-index', newIndex);
        
        const allInfos = document.querySelectorAll(`.info-group-${id}`);
        allInfos.forEach((el, idx) => {
            if(idx === newIndex) {
                el.style.display = 'block';
                el.style.animation = 'none';
                el.offsetHeight;
                el.style.animation = 'fadeIn 0.4s';
            } else {
                el.style.display = 'none';
            }
        });
    };

    function generateRollerHTML(id, title, variants, type) {
        let imagesHTML = '';
        let infoHTML = '';

        variants.forEach((v, idx) => {
            const img = v.image || 'https://placehold.co/100x100/333/white?text=IMG';
            imagesHTML += `<img src="${img}" class="roller-img">`;

            const displayStyle = idx === 0 ? 'block' : 'none';
            
            let buttons = '';
            if(type === 'tool') {
                buttons = `
                    <div class="roller-actions">
                        <a href="${v.amazon}" target="_blank" class="mini-store-btn btn-amazon"><img src="images/amazon-logo.png"></a>
                        <a href="${v.aliexpress}" target="_blank" class="mini-store-btn btn-ali"><img src="images/aliexpress-logo.png"></a>
                    </div>
                `;
            } else if (type === 'video') {
                const btnColor = title.includes('YouTube') ? '#c4302b' : '#000000';
                const icon = title.includes('YouTube') ? ICONS.youtube : ICONS.tiktok;
                const btnClass = title.includes('YouTube') ? 'video-btn youtube' : 'tiktok-btn';
                
                buttons = `
                    <div class="roller-actions">
                        <a href="${v.url}" target="_blank" class="action-btn ${btnClass}" style="padding:8px; font-size:0.8rem; width:100%; display:flex; justify-content:center;">${icon} Ver Video</a>
                    </div>
                `;
            }

            infoHTML += `
                <div class="info-group-${id}" style="display: ${displayStyle}; width: 100%;">
                    <div class="roller-name">${v.name}</div>
                    ${buttons}
                </div>
            `;
        });

        return `
            <div class="roller-container ${type === 'video' ? 'video-roller' : ''}">
                <div class="roller-header">${title}</div>
                <div class="roller-body">
                    <div class="roller-controls">
                        <button class="arrow-btn" onclick="moveRoller('${id}', -1, ${variants.length})">▲</button>
                        <button class="arrow-btn" onclick="moveRoller('${id}', 1, ${variants.length})">▼</button>
                    </div>
                    <div class="roller-window">
                        <div id="track-${id}" class="roller-track" data-index="0">${imagesHTML}</div>
                    </div>
                    <div class="roller-info">${infoHTML}</div>
                </div>
            </div>
        `;
    }

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

    function applyFilters() {
        const term = searchInput.value.toLowerCase();
        const filtered = allSolutions.filter(sol => {
            const matchText = sol.title.toLowerCase().includes(term) || sol.problem.toLowerCase().includes(term);
            let matchCat = true;
            if (currentCategory === 'favorites') matchCat = favorites.includes(sol.title);
            else if (currentCategory !== 'all') matchCat = sol.category === currentCategory;
            let matchDiff = true;
            if (currentDifficulty !== 'all') matchDiff = sol.risk_level === currentDifficulty;
            return matchText && matchCat && matchDiff;
        });
        renderSolutions(filtered);
    }

    searchInput.addEventListener('input', applyFilters);

    catButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentCatIndex = index;
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            currentCategory = btn.getAttribute('data-cat');
            applyFilters();
        });
    });

    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            diffButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDifficulty = btn.getAttribute('data-diff');
            applyFilters();
        });
    });

    // SWIPE
    let touchStartX = 0;
    let touchStartY = 0;
    document.addEventListener('touchstart', e => {
        if (e.target.closest('.category-scroll') || e.target.closest('.difficulty-scroll')) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, {passive: false});
    document.addEventListener('touchend', e => {
        if (e.target.closest('.category-scroll') || e.target.closest('.difficulty-scroll')) return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
    }, {passive: false});

    function handleSwipe(startX, startY, endX, endY) {
        const diffX = startX - endX;
        const diffY = startY - endY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) changeCategory(currentCatIndex + 1);
            else changeCategory(currentCatIndex - 1);
        }
    }
    function changeCategory(index) {
        if (index >= 0 && index < catButtons.length) catButtons[index].click();
    }

    // LÓGICA CÁMARA CON BACKEND SEGURO
    lensBtn.addEventListener('click', () => {
        cameraInput.click();
    });

    cameraInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        modal.style.display = "flex";
        modalBody.innerHTML = `<div class="ai-loading" style="text-align:center; padding:40px; color:white;"><div style="font-size:3rem; animation:bounce 1s infinite;">🧠</div><h3 style="margin-top:20px;">Analizando...</h3><p style="color:#cbd5e1; font-size:0.9rem;">Dame unos segundos.</p></div>`;
        
        try {
            const base64Image = await fileToBase64(file);
            
            // Llamada al servidor Vercel (api/gemini.js)
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image.split(',')[1] }) 
            });

            if (!response.ok) throw new Error("Error en el servidor de IA");
            const result = await response.json();

            openModal({
                title: result.title || "Detectado", solution_text: result.text, image_url: URL.createObjectURL(file), category: "IA Detectada", risk_level: "Bajo", difficulty: 1,
                affiliate_url_primary: `https://www.amazon.es/s?k=${encodeURIComponent(result.keyword)}`,
                affiliate_url_secondary: `https://es.aliexpress.com/wholesale?SearchText=${encodeURIComponent(result.keyword)}`,
                video_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(result.keyword + " tutorial")}`,
                tiktok_url: `https://www.tiktok.com/search/video?q=${encodeURIComponent(result.keyword + " hack")}`
            });
        } catch (error) {
            modalBody.innerHTML = `<div style="text-align:center; padding:30px; color:white;"><h3 style="color:#ef4444;">Error</h3><p>${error.message}</p><button onclick="document.getElementById('detailModal').style.display='none'" class="action-btn" style="background:#333; margin-top:20px;">Cerrar</button></div>`;
        }
        cameraInput.value = '';
    });

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxWidth = 800;
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
            reader.onerror = error => reject(error);
        });
    }

    function toggleFavorite(e, title) {
        e.stopPropagation();
        if (favorites.includes(title)) favorites = favorites.filter(t => t !== title);
        else favorites.push(title);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        if (currentCategory === 'favorites') applyFilters();
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
            let msg = 'No hay resultados 🤷‍♂️';
            if(currentCategory === 'favorites') msg = 'Aún no tienes favoritos ❤️<br><small>Dale al corazón en los trucos que te gusten.</small>';
            list.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:rgba(255,255,255,0.7); margin-top:30px;">${msg}</div>`;
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
                <div class="card-image-container"><img src="${imageSrc}" alt="${sol.title}" class="card-img"></div>
                <div class="card-content"><h3 class="card-title">${sol.title}</h3>${dots}</div>
            `;
            card.querySelector('.fav-icon').addEventListener('click', (e) => toggleFavorite(e, sol.title));
            card.addEventListener('click', (e) => { if(!e.target.classList.contains('fav-icon')) openModal(sol); });
            observer.observe(card);
            list.appendChild(card);
        });
    }

    function openModal(sol) {
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

        const marketingHTML = `<div class="marketing-box"><p>💡 El truco te salva hoy, pero equípate para mañana.</p></div>`;

        // RODILLO HERRAMIENTAS
        let toolsHTML = '';
        if (sol.tools && sol.tools.length > 0) {
            if(sol.tools[0].variants) {
                sol.tools.forEach((toolSlot, idx) => {
                    toolsHTML += generateRollerHTML(`tool-${idx}`, toolSlot.title, toolSlot.variants, 'tool');
                });
                toolsHTML = `<div class="tools-section"><div class="tools-title">🛠️ Herramientas Pro (Desliza)</div>${toolsHTML}</div>`;
            } else {
                let toolsListHTML = '';
                sol.tools.forEach(tool => {
                    const toolImg = tool.image || 'https://placehold.co/100x100/white/black?text=Tool';
                    toolsListHTML += `<div class="tool-card"><img src="${toolImg}" class="tool-img-static" alt="${tool.name}"><div class="tool-info"><div class="tool-name">${tool.name}</div><div class="tool-actions"><a href="${tool.amazon}" target="_blank" class="store-btn btn-amazon"><img src="images/amazon-logo.png"></a><a href="${tool.aliexpress}" target="_blank" class="store-btn btn-ali"><img src="images/aliexpress-logo.png"></a></div></div></div>`;
                });
                toolsHTML = `<div class="tools-section"><div class="tools-title">🛠️ Herramientas</div><div class="tools-grid">${toolsListHTML}</div></div>`;
            }
        }

        // RODILLO VIDEOS
        let videoHTML = '';
        if(sol.videos) {
             sol.videos.forEach((vidSlot, idx) => {
                videoHTML += generateRollerHTML(`vid-${idx}`, vidSlot.platform, vidSlot.variants, 'video');
             });
        } else {
             const ytUrl = sol.video_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(sol.title + " truco casero")}`;
             const tiktokLink = sol.tiktok_url || `https://www.tiktok.com/search/video?q=${encodeURIComponent(sol.title + " hack")}`;
             videoHTML = `<div class="section-label">📺 Videotutoriales:</div><div class="video-actions"><a href="${ytUrl}" target="_blank" class="action-btn video-btn youtube">${ICONS.youtube} YouTube</a><a href="${tiktokLink}" target="_blank" class="action-btn tiktok-btn">${ICONS.tiktok} TikTok</a></div>`;
        }
        
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`¡Mira este truco: ${sol.title}! 👉 https://el-apanador-jesus.onrender.com`)}`;
        const modalImageSrc = sol.image_url || 'https://placehold.co/600x300/e2e8f0/475569?text=Sin+Foto';

        // RELACIONADOS
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
                relatedHTML += `<div class="related-card" onclick="document.dispatchEvent(new CustomEvent('openRelated', {detail: '${r.title}'}))"><img src="${rImg}" class="related-img"><div class="related-text">${r.title}</div></div>`;
            });
            relatedHTML += `</div></div>`;
        }

        modalBody.innerHTML = `
            <img src="${modalImageSrc}" alt="${sol.title}" class="modal-hero-img">
            <div style="padding:20px;">
                <h2 style="margin-top:0">${sol.title}</h2>
                <p style="font-size:1.1rem; line-height: 1.6; opacity: 0.9; margin-bottom: 25px;">${sol.solution_text}</p>
                ${marketingHTML}
                ${toolsHTML}
                ${videoHTML}
                <a href="${whatsappUrl}" target="_blank" class="action-btn whatsapp-btn">${ICONS.whatsapp} Compartir</a>
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
