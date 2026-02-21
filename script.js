// Array de pares: cada par tiene una imagen y una palabra
const cardPairs = [
    { image: 'https://via.placeholder.com/100?text=🍎', word: 'derecho' },
    { image: 'https://via.placeholder.com/100?text=🍊', word: 'Naranja' },
    { image: 'https://via.placeholder.com/100?text=🍋', word: 'Limón' },
    { image: 'https://via.placeholder.com/100?text=🍌', word: 'Plátano' },
    { image: 'https://via.placeholder.com/100?text=🍉', word: 'Sandía' },
    { image: 'https://via.placeholder.com/100?text=🍓', word: 'Fresa' },
    { image: 'https://via.placeholder.com/100?text=🍇', word: 'Uva' },
    { image: 'https://via.placeholder.com/100?text=🍒', word: 'Cereza' }
];

let gameCards = [];
let matched = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;

// Inicializar el juego
function initGame() {
    gameCards = [];
    matched = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    
    // Crear cartas: imágenes y palabras separadas
    const cards = [];
    
    cardPairs.forEach((pair, index) => {
        // Agregar tarjeta de imagen
        cards.push({
            id: index * 2,
            type: 'image',
            image: pair.image,
            word: pair.word,
            pairId: index,
            flipped: false,
            matched: false
        });
        
        // Agregar tarjeta de palabra
        cards.push({
            id: index * 2 + 1,
            type: 'word',
            image: pair.image,
            word: pair.word,
            pairId: index,
            flipped: false,
            matched: false
        });
    });
    
    // Barajar las cartas
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    gameCards = cards;
    renderBoard();
    updateStats();
}

// Renderizar el tablero
function renderBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    gameCards.forEach((card, index) => {
        const cardElement = document.createElement('button');
        cardElement.className = 'card';
        if (card.flipped) cardElement.classList.add('flipped');
        if (card.matched) cardElement.classList.add('matched');
        
        let content = '';
        
        if (card.type === 'image') {
            content = `
                <div class="card-front">🎴</div>
                <div class="card-back">
                    <img src="${card.image}" alt="${card.word}" class="card-image">
                </div>
            `;
        } else {
            content = `
                <div class="card-front">🎴</div>
                <div class="card-back">
                    <div class="card-word">${card.word}</div>
                </div>
            `;
        }
        
        cardElement.innerHTML = content;
        cardElement.addEventListener('click', () => flipCard(index, cardElement));
        gameBoard.appendChild(cardElement);
    });
}

// Voltear tarjeta
function flipCard(index, cardElement) {
    if (lockBoard) return;
    if (gameCards[index].flipped || gameCards[index].matched) return;
    
    gameCards[index].flipped = true;
    cardElement.classList.add('flipped');
    
    if (!firstCard) {
        firstCard = { index, cardElement };
    } else {
        secondCard = { index, cardElement };
        checkMatch();
    }
}

// Verificar si las tarjetas coinciden
function checkMatch() {
    lockBoard = true;
    
    // Las cartas coinciden si tienen el mismo pairId (imagen con palabra)
    const isMatch = gameCards[firstCard.index].pairId === gameCards[secondCard.index].pairId;
    
    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Desactivar tarjetas que coincidieron
function disableCards() {
    gameCards[firstCard.index].matched = true;
    gameCards[secondCard.index].matched = true;
    
    firstCard.cardElement.classList.add('matched');
    secondCard.cardElement.classList.add('matched');
    
    matched += 2;
    updateStats();
    
    resetCards();
    
    // Verificar si ganó
    if (matched === gameCards.length) {
        showWinMessage();
    }
}

// Voltear tarjetas nuevamente
function unflipCards() {
    setTimeout(() => {
        gameCards[firstCard.index].flipped = false;
        gameCards[secondCard.index].flipped = false;
        
        firstCard.cardElement.classList.remove('flipped');
        secondCard.cardElement.classList.remove('flipped');
        
        resetCards();
    }, 1000);
}

// Reiniciar variables
function resetCards() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Actualizar estadísticas
function updateStats() {
    document.getElementById('matched').textContent = matched / 2;
}

// Mostrar mensaje de victoria
function showWinMessage() {
    document.getElementById('winMessage').classList.remove('hidden');
}

// Reiniciar juego
document.getElementById('resetBtn').addEventListener('click', initGame);

// Iniciar juego al cargar
initGame();