const stackContainer = document.getElementById('card-stack');
const btnNope = document.getElementById('btn-nope');
const btnLove = document.getElementById('btn-love');
const selector = document.getElementById('style-select');
const favoritesList = document.getElementById('favorites-list');

// IMPORTANTE: Pon tu Access Key de Unsplash aquí
const ACCESS_KEY = 'kc8OeEfBGukWIMFTm1arllNeGvSIMRwRqRHZewK-TC4'; 

let cardsData = []; // Aquí guardaremos las URLs
let currentCardIndex = 0;

// 1. Función para buscar imágenes según la categoría
async function fetchImages(query) {
    stackContainer.innerHTML = '<div class="loading-msg">Buscando estilos... 💅</div>';
    
    // Pedimos 30 fotos aleatorias de esa categoría
    const url = `https://api.unsplash.com/photos/random?count=30&query=${query}&orientation=portrait&client_id=${ACCESS_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Limpiamos y cargamos nuevas
        cardsData = data;
        currentCardIndex = 0;
        renderStack();
    } catch (error) {
        console.error('Error:', error);
        stackContainer.innerHTML = '<p>Error cargando o límite de API excedido :(</p>';
    }
}

// 2. Renderizar la pila de cartas
function renderStack() {
    stackContainer.innerHTML = '';
    
    // Renderizamos solo las siguientes 2 cartas para ahorrar memoria (truco de ingeniero)
    // Pero para simplificar, renderizamos el actual
    if (currentCardIndex >= cardsData.length) {
        stackContainer.innerHTML = '<div class="loading-msg">¡Se acabaron! Cambia de estilo 👆</div>';
        return;
    }

    const cardInfo = cardsData[currentCardIndex];
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.backgroundImage = `url(${cardInfo.urls.regular})`;
    
    stackContainer.appendChild(card);
}

// 3. Lógica de Swipe (Darle Like o Nope)
function swipe(action) {
    const card = document.querySelector('.card');
    if (!card) return;

    if (action === 'love') {
        card.classList.add('swiped-right');
        saveFavorite(cardsData[currentCardIndex].urls.small);
    } else {
        card.classList.add('swiped-left');
    }

    // Esperar la animación y cargar la siguiente
    setTimeout(() => {
        currentCardIndex++;
        renderStack();
    }, 300);
}

// 4. Guardar en favoritos (Barra inferior)
function saveFavorite(url) {
    const img = document.createElement('img');
    img.src = url;
    img.classList.add('fav-img');
    // Al hacer click en favorita, abrir en grande
    img.onclick = () => window.open(url, '_blank');
    favoritesList.prepend(img);
}

// Event Listeners
btnNope.addEventListener('click', () => swipe('nope'));
btnLove.addEventListener('click', () => swipe('love'));

selector.addEventListener('change', (e) => {
    fetchImages(e.target.value);
});

// Cargar inicial (Francesas por defecto)
fetchImages('french nail art');