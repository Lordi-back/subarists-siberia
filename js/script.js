// Субаристы Сибири — основной скрипт

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initTabs();
    initSmoothScroll();
});

// Загрузка данных из JSON
async function loadData() {
    try {
        const response = await fetch('js/data.json');
        const data = await response.json();
        
        renderPriceTable(data.prices, 'engine');
        renderSchedule(data.schedule);
        renderMasters(data.masters);
        renderReviews(data.reviews);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        
        // Если JSON не загрузился (например, локально без сервера) — 
        // используем встроенные данные
        const fallbackData = getFallbackData();
        renderPriceTable(fallbackData.prices, 'engine');
        renderSchedule(fallbackData.schedule);
        renderMasters(fallbackData.masters);
        renderReviews(fallbackData.reviews);
    }
}

// Рендер таблицы цен
function renderPriceTable(prices, category) {
    const tbody = document.getElementById('priceTableBody');
    const items = prices[category] || [];
    
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>
                <strong>${item.name}</strong>
                ${item.models ? `<br><small style="color: #888;">${item.models}</small>` : ''}
            </td>
            <td>${item.price}</td>
            <td>${item.time}</td>
        </tr>
    `).join('');
}

// Рендер расписания
function renderSchedule(schedule) {
    const grid = document.getElementById('scheduleGrid');
    
    const statusLabels = {
        free: 'Свободно',
        almost: 'Почти занято',
        busy: 'Занято'
    };
    
    const statusIcons = {
        free: '🟢',
        almost: '🟡',
        busy: '🔴'
    };
    
    grid.innerHTML = schedule.map(day => `
        <div class="schedule-day">
            <div class="schedule-day__name">${day.day}</div>
            <div class="schedule-day__date">${day.date}</div>
            <div class="schedule-day__status status--${day.status}">
                ${statusIcons[day.status]} ${statusLabels[day.status]}
            </div>
        </div>
    `).join('');
}

// Рендер мастеров
function renderMasters(masters) {
    const grid = document.getElementById('mastersGrid');
    
    grid.innerHTML = masters.map(master => `
        <div class="master-card">
            <div class="master-card__avatar">${master.emoji}</div>
            <div class="master-card__info">
                <h3 class="master-card__name">${master.name}</h3>
                <p class="master-card__spec">${master.specialization}</p>
                <p class="master-card__desc">${master.description}</p>
            </div>
        </div>
    `).join('');
}

// Рендер отзывов
function renderReviews(reviews) {
    const grid = document.getElementById('reviewsGrid');
    
    grid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-card__header">
                <div class="review-card__avatar">${review.initials}</div>
                <div>
                    <div class="review-card__name">${review.name}</div>
                    <div class="review-card__car">${review.car}</div>
                </div>
            </div>
            <div class="review-card__stars">${'★'.repeat(review.stars)}</div>
            <p class="review-card__text">«${review.text}»</p>
        </div>
    `).join('');
}

// Табы категорий цен
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            // Обновляем активный таб
            tabs.forEach(t => t.classList.remove('tab--active'));
            tab.classList.add('tab--active');
            
            const category = tab.dataset.category;
            
            try {
                const response = await fetch('js/data.json');
                const data = await response.json();
                renderPriceTable(data.prices, category);
            } catch {
                const fallbackData = getFallbackData();
                renderPriceTable(fallbackData.prices, category);
            }
        });
    });
}

// Плавный скролл для всех якорных ссылок
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Fallback данные на случай, если JSON недоступен локально
function getFallbackData() {
    return {
        prices: {
            engine: [
                { name: "Замена свечей зажигания (4 шт.)", models: "EJ20/EJ25, FB20/FB25", price: "2 500 ₽", time: "1–1,5 ч" },
                { name: "Замена прокладок ГБЦ", models: "Все оппозитные двигатели", price: "от 15 000 ₽", time: "8–16 ч" },
                { name: "Замена цепи/ремня ГРМ", models: "EJ, FA, FB", price: "от 6 000 ₽", time: "4–8 ч" },
                { name: "Замена масла в ДВС (с фильтром)", models: "Все модели", price: "800 ₽", time: "30 мин" }
            ],
            transmission: [
                { name: "Замена масла в вариаторе Lineartronic", models: "TR580, TR690", price: "1 800 ₽", time: "1 ч" },
                { name: "Замена масла в АКПП (полный цикл)", models: "Все АКПП", price: "3 500 ₽", time: "1,5–2 ч" }
            ],
            suspension: [
                { name: "Замена передних амортизаторов", models: "Все модели", price: "3 000 ₽", time: "2,5 ч" },
                { name: "Замена ступичного подшипника", models: "Перед / зад", price: "от 2 500 ₽", time: "зависит от оси" }
            ],
            maintenance: [
                { name: "ТО-1", models: "Все модели", price: "1 500 ₽", time: "1 ч" },
                { name: "Замена тормозных колодок", models: "Все модели", price: "1 200 ₽", time: "1 ч" }
            ]
        },
        schedule: [
            { day: "Понедельник", date: "07.07.2026", status: "free" },
            { day: "Вторник", date: "08.07.2026", status: "almost" },
            { day: "Среда", date: "09.07.2026", status: "free" },
            { day: "Четверг", date: "10.07.2026", status: "busy" },
            { day: "Пятница", date: "11.07.2026", status: "almost" }
        ],
        masters: [
            { name: "Алексей", specialization: "Моторист", emoji: "🔧", description: "Главный по оппозиту. 10 лет с Subaru." },
            { name: "Дмитрий", specialization: "Трансмиссия", emoji: "⚙️", description: "Вариаторных дел мастер." }
        ],
        reviews: [
            { name: "Андрей", car: "Subaru Forester SH", initials: "А", stars: 5, text: "Отличный сервис!" }
        ]
    };
}
