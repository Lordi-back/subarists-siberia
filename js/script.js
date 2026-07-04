// Субаристы Сибири — основной скрипт (все данные из data.json)
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    loadAllData();
    initTabs();
    initSmoothScroll();
    initScrollAnimations();
});

function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 800));
}

function loadAllData() {
    fetch('js/data.json')
        .then(r => r.json())
        .then(data => {
            renderPriceTable(data.prices, 'engine');
            renderSchedule(data.schedule);
            renderMasters(data.masters);
            renderReviews(data.reviews);
        })
        .catch(() => {
            console.log('Загружаем резервные данные');
            const fb = fallbackData();
            renderPriceTable(fb.prices, 'engine');
            renderSchedule(fb.schedule);
            renderMasters(fb.masters);
            renderReviews(fb.reviews);
        });
}

function renderPriceTable(prices, category) {
    const items = prices[category] || [];
    document.getElementById('priceTableBody').innerHTML = items.map(item => `
        <tr style="animation: fadeInUp 0.5s forwards; opacity: 0;">
            <td><strong>${item.name}</strong>${item.models ? `<br><small style="color:#999;">${item.models}</small>` : ''}</td>
            <td>${item.price}</td>
            <td>${item.time}</td>
        </tr>
    `).join('');
}

function renderSchedule(schedule) {
    const labels = { free: 'Свободно', almost: 'Почти занято', busy: 'Занято' };
    const icons = { free: '🟢', almost: '🟡', busy: '🔴' };
    document.getElementById('scheduleGrid').innerHTML = schedule.map(day => `
        <div class="schedule-day" style="animation: fadeInUp 0.5s forwards; opacity: 0;">
            <div class="schedule-day__name">${day.day}</div>
            <div class="schedule-day__date">${day.date}</div>
            <div class="schedule-day__status status--${day.status}">${icons[day.status]} ${labels[day.status]}</div>
        </div>
    `).join('');
}

function renderMasters(masters) {
    document.getElementById('mastersGrid').innerHTML = masters.map(master => `
        <div class="master-card" style="animation: fadeInUp 0.6s forwards; opacity: 0;">
            <div class="master-card__avatar">${master.emoji}</div>
            <div class="master-card__info">
                <h3 class="master-card__name">${master.name}</h3>
                <p class="master-card__spec">${master.specialization}</p>
                <p class="master-card__desc">${master.description}</p>
            </div>
        </div>
    `).join('');
}

function renderReviews(reviews) {
    document.getElementById('reviewsGrid').innerHTML = reviews.map(review => `
        <div class="review-card" style="animation: fadeInUp 0.6s forwards; opacity: 0;">
            <div class="review-card__header">
                <div class="review-card__avatar">${review.initials}</div>
                <div><div class="review-card__name">${review.name}</div><div class="review-card__car">${review.car}</div></div>
            </div>
            <div class="review-card__stars">${'★'.repeat(review.stars)}</div>
            <p class="review-card__text">«${review.text}»</p>
        </div>
    `).join('');
}

function initTabs() {
    document.querySelectorAll('#priceTabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#priceTabs .tab').forEach(t => t.classList.remove('tab--active'));
            tab.classList.add('tab--active');
            fetch('js/data.json').then(r => r.json()).then(data => renderPriceTable(data.prices, tab.dataset.category)).catch(() => renderPriceTable(fallbackData().prices, tab.dataset.category));
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const t = document.querySelector(this.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
}

function initScrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.style.opacity = '1'; obs.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.master-card, .review-card, .step, .schedule-day').forEach(el => { el.style.opacity = '0'; obs.observe(el); });
}

function fallbackData() {
    return {
        prices: {
            engine: [{ name: "Замена свечей", models: "EJ/FB", price: "2 500 ₽", time: "1-1.5 ч" }, { name: "Прокладки ГБЦ", models: "Все", price: "от 15 000 ₽", time: "8-16 ч" }, { name: "Цепь/ремень ГРМ", models: "EJ/FA/FB", price: "от 6 000 ₽", time: "4-8 ч" }, { name: "Масло ДВС", models: "Все", price: "800 ₽", time: "30 мин" }, { name: "Чистка дросселя", models: "FB/EZ", price: "1 500 ₽", time: "1 ч" }, { name: "Диагностика", models: "Все", price: "1 200 ₽", time: "30-40 мин" }],
            transmission: [{ name: "Масло вариатор", models: "TR580/690", price: "1 800 ₽", time: "1 ч" }, { name: "Масло АКПП", models: "Все", price: "3 500 ₽", time: "1.5-2 ч" }, { name: "Масло редуктор", models: "Перед/зад", price: "1 200 ₽", time: "40 мин" }, { name: "Масло дифф.", models: "4WD", price: "1 200 ₽", time: "40 мин" }, { name: "Диагностика вариатора", models: "Lineartronic", price: "1 500 ₽", time: "1 ч" }],
            suspension: [{ name: "Амортизаторы перед", models: "Все", price: "3 000 ₽", time: "2.5 ч" }, { name: "Амортизаторы зад", models: "Все", price: "2 500 ₽", time: "2 ч" }, { name: "Сайлентблоки", models: "Перед", price: "от 1 500 ₽", time: "-" }, { name: "Ступичный", models: "Перед/зад", price: "от 2 500 ₽", time: "-" }, { name: "Шаровая", models: "Все", price: "1 200 ₽", time: "1 ч" }],
            maintenance: [{ name: "ТО-1", models: "Все", price: "1 500 ₽", time: "1 ч" }, { name: "ТО-2", models: "Все", price: "от 4 000 ₽", time: "2-3 ч" }, { name: "Колодки", models: "Все", price: "1 200 ₽", time: "1 ч" }, { name: "Торм. жидкость", models: "Все", price: "1 500 ₽", time: "1 ч" }, { name: "Антифриз", models: "Все", price: "1 800 ₽", time: "1.5 ч" }]
        },
        schedule: [
            { day: "Пн", date: "07.07", status: "free" }, { day: "Вт", date: "08.07", status: "almost" },
            { day: "Ср", date: "09.07", status: "free" }, { day: "Чт", date: "10.07", status: "busy" },
            { day: "Пт", date: "11.07", status: "almost" }, { day: "Сб", date: "12.07", status: "free" },
            { day: "Вс", date: "13.07", status: "busy" }
        ],
        masters: [
            { name: "Алексей", specialization: "Моторист", emoji: "🔧", description: "Главный по оппозиту. 10 лет с Subaru." },
            { name: "Дмитрий", specialization: "Трансмиссия", emoji: "⚙️", description: "Вариаторных дел мастер." },
            { name: "Иван", specialization: "Ходовая", emoji: "🛞", description: "Владелец Forester SH." }
        ],
        reviews: [
            { name: "Андрей", car: "Forester SH", initials: "А", stars: 5, text: "Отличный сервис! Поменяли прокладки ГБЦ на FB25." },
            { name: "Сергей", car: "Outback BR", initials: "С", stars: 5, text: "Обслуживаю вариатор только здесь." }
        ]
    };
}
