// Обновлённый script.js с анимациями

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    loadData();
    initTabs();
    initSmoothScroll();
    initScrollAnimations();
    initParallax();
});

// Прелоадер
function initLoader() {
    const loader = document.querySelector('.loader');
    if (!loader) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Запускаем анимации после загрузки
            document.querySelectorAll('.animate').forEach((el, i) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                }, i * 100);
            });
        }, 800);
    });
}

// Частицы на Hero
function initParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'hero-particles';
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 6 + 4) + 's';
        particle.style.width = (Math.random() * 3 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particlesContainer.appendChild(particle);
    }
}

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
        console.log('Используем fallback данные');
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
    
    tbody.innerHTML = items.map((item, index) => `
        <tr style="animation: fadeInUp 0.5s ${index * 0.05}s forwards; opacity: 0;">
            <td>
                <strong>${item.name}</strong>
                ${item.models ? `<br><small style="color: #999;">${item.models}</small>` : ''}
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
    
    grid.innerHTML = schedule.map((day, index) => `
        <div class="schedule-day" style="animation: fadeInUp 0.5s ${index * 0.08}s forwards; opacity: 0;">
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
    
    grid.innerHTML = masters.map((master, index) => `
        <div class="master-card" style="animation: fadeInUp 0.6s ${index * 0.15}s forwards; opacity: 0;">
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
    
    grid.innerHTML = reviews.map((review, index) => `
        <div class="review-card" style="animation: fadeInUp 0.6s ${index * 0.15}s forwards; opacity: 0;">
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

// Табы
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', async () => {
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

// Плавный скролл
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Анимации при скролле
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                
                if (el.classList.contains('master-card')) {
                    el.style.animation = 'fadeInUp 0.6s forwards';
                } else if (el.classList.contains('review-card')) {
                    el.style.animation = 'fadeInUp 0.6s forwards';
                } else if (el.classList.contains('step')) {
                    el.style.animation = 'fadeInUp 0.5s forwards';
                } else if (el.classList.contains('schedule-day')) {
                    el.style.animation = 'fadeInUp 0.5s forwards';
                }
                
                observer.unobserve(el);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за секциями
    document.querySelectorAll('.master-card, .review-card, .step, .schedule-day').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Лёгкий параллакс для Hero
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        const circles = hero.querySelectorAll('::before, ::after');
        // Параллакс делаем через transform самого hero
        hero.style.backgroundPosition = `center ${rate * 0.5}px`;
    });
}

// Fallback данные
function getFallbackData() {
    return {
        prices: {
            engine: [
                { name: "Замена свечей зажигания (4 шт.)", models: "EJ20/EJ25, FB20/FB25", price: "2 500 ₽", time: "1–1,5 ч" },
                { name: "Замена прокладок ГБЦ", models: "Все оппозитные двигатели", price: "от 15 000 ₽", time: "8–16 ч" },
                { name: "Замена цепи/ремня ГРМ", models: "EJ, FA, FB", price: "от 6 000 ₽", time: "4–8 ч" },
                { name: "Замена масла в ДВС (с фильтром)", models: "Все модели", price: "800 ₽", time: "30 мин" },
                { name: "Чистка дроссельной заслонки + адаптация", models: "FB20/FB25, EZ36", price: "1 500 ₽", time: "1 ч" },
                { name: "Диагностика двигателя", models: "Все модели", price: "1 200 ₽", time: "30–40 мин" }
            ],
            transmission: [
                { name: "Замена масла в вариаторе Lineartronic", models: "TR580, TR690", price: "1 800 ₽", time: "1 ч" },
                { name: "Замена масла в АКПП (полный цикл)", models: "Все АКПП", price: "3 500 ₽", time: "1,5–2 ч" },
                { name: "Замена масла в редукторе", models: "Передний / задний", price: "1 200 ₽", time: "40 мин" },
                { name: "Замена масла в заднем дифференциале", models: "Все полноприводные", price: "1 200 ₽", time: "40 мин" },
                { name: "Диагностика вариатора", models: "Lineartronic", price: "1 500 ₽", time: "1 ч" }
            ],
            suspension: [
                { name: "Замена передних амортизаторов (пара)", models: "Все модели", price: "3 000 ₽", time: "2,5 ч" },
                { name: "Замена задних амортизаторов (пара)", models: "Все модели", price: "2 500 ₽", time: "2 ч" },
                { name: "Перепрессовка сайлентблоков", models: "Передняя подвеска", price: "от 1 500 ₽", time: "зависит от рычага" },
                { name: "Замена ступичного подшипника", models: "Перед / зад", price: "от 2 500 ₽", time: "зависит от оси" },
                { name: "Замена шаровой опоры", models: "Все модели", price: "1 200 ₽", time: "1 ч" }
            ],
            maintenance: [
                { name: "ТО-1", models: "Все модели", price: "1 500 ₽", time: "1 ч" },
                { name: "ТО-2 (полное)", models: "Все модели", price: "от 4 000 ₽", time: "2–3 ч" },
                { name: "Замена тормозных колодок", models: "Все модели", price: "1 200 ₽", time: "1 ч" },
                { name: "Замена тормозной жидкости", models: "Все модели", price: "1 500 ₽", time: "1 ч" },
                { name: "Замена охлаждающей жидкости", models: "Все модели", price: "1 800 ₽", time: "1,5 ч" }
            ]
        },
        schedule: [
            { day: "Понедельник", date: "07.07.2026", status: "free" },
            { day: "Вторник", date: "08.07.2026", status: "almost" },
            { day: "Среда", date: "09.07.2026", status: "free" },
            { day: "Четверг", date: "10.07.2026", status: "busy" },
            { day: "Пятница", date: "11.07.2026", status: "almost" },
            { day: "Суббота", date: "12.07.2026", status: "free" },
            { day: "Воскресенье", date: "13.07.2026", status: "busy" }
        ],
        masters: [
            { name: "Алексей", specialization: "Моторист", emoji: "🔧", description: "Главный по оппозиту. 10 лет с Subaru. Перебрал 200+ моторов EJ." },
            { name: "Дмитрий", specialization: "Трансмиссия", emoji: "⚙️", description: "Вариаторных дел мастер. Диагностика и ремонт Lineartronic." },
            { name: "Иван", specialization: "Ходовая часть", emoji: "🛞", description: "Владелец Forester SH. Знает всё о ступичных и подвеске Субару." }
        ],
        reviews: [
            { name: "Андрей", car: "Subaru Forester SH, 2012", initials: "А", stars: 5, text: "Ребята знают свою работу. Поменяли прокладки ГБЦ на FB25 — всё чётко, с фотоотчётом. Машина летает уже полгода!" },
            { name: "Сергей", car: "Subaru Outback BR, 2015", initials: "С", stars: 5, text: "Обслуживаю вариатор только здесь. Делают частичную замену каждые 30 тысяч — полёт нормальный. Цены адекватные." },
            { name: "Денис", car: "Subaru Impreza WRX, 2008", initials: "Д", stars: 5, text: "Перебрали движок EJ205 после стука. Всё по уму: замерили, подобрали вкладыши. Фотоотчёт на каждом этапе." }
        ]
    };
}
