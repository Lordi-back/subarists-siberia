// Субаристы Сибири
document.addEventListener('DOMContentLoaded', function() {
    // Прелоадер
    var loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', function() {
            setTimeout(function() { loader.classList.add('hidden'); }, 800);
        });
    }
    
    // Загрузка данных из data.json
    loadData();
    initTabs();
    initSmoothScroll();
});

function loadData() {
    fetch('js/data.json')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            renderPriceTable(data.prices, 'engine');
            renderSchedule(data.schedule);
            renderMasters(data.masters);
            renderReviews(data.reviews);
        })
        .catch(function() {
            console.log('Ошибка загрузки JSON');
        });
}

function renderPriceTable(prices, category) {
    var items = prices[category] || [];
    var html = '';
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<tr><td><strong>' + item.name + '</strong>';
        if (item.models) html += '<br><small style="color:#999;">' + item.models + '</small>';
        html += '</td><td>' + item.price + '</td><td>' + item.time + '</td></tr>';
    }
    document.getElementById('priceTableBody').innerHTML = html;
}

function renderSchedule(schedule) {
    var labels = { free: 'Свободно', almost: 'Почти занято', busy: 'Занято' };
    var icons = { free: '🟢', almost: '🟡', busy: '🔴' };
    var html = '';
    for (var i = 0; i < schedule.length; i++) {
        var d = schedule[i];
        html += '<div class="schedule-day"><div class="schedule-day__name">' + d.day + '</div>';
        html += '<div class="schedule-day__date">' + d.date + '</div>';
        html += '<div class="schedule-day__status status--' + d.status + '">' + icons[d.status] + ' ' + labels[d.status] + '</div></div>';
    }
    document.getElementById('scheduleGrid').innerHTML = html;
}

function renderMasters(masters) {
    var html = '';
    for (var i = 0; i < masters.length; i++) {
        var m = masters[i];
        html += '<div class="master-card"><div class="master-card__avatar">' + m.emoji + '</div>';
        html += '<div class="master-card__info"><h3 class="master-card__name">' + m.name + '</h3>';
        html += '<p class="master-card__spec">' + m.specialization + '</p>';
        html += '<p class="master-card__desc">' + m.description + '</p></div></div>';
    }
    document.getElementById('mastersGrid').innerHTML = html;
}

function renderReviews(reviews) {
    var html = '';
    for (var i = 0; i < reviews.length; i++) {
        var r = reviews[i];
        html += '<div class="review-card"><div class="review-card__header">';
        html += '<div class="review-card__avatar">' + r.initials + '</div>';
        html += '<div><div class="review-card__name">' + r.name + '</div>';
        html += '<div class="review-card__car">' + r.car + '</div></div></div>';
        var stars = '';
        for (var s = 0; s < r.stars; s++) stars += '★';
        html += '<div class="review-card__stars">' + stars + '</div>';
        html += '<p class="review-card__text">«' + r.text + '»</p></div>';
    }
    document.getElementById('reviewsGrid').innerHTML = html;
}

function initTabs() {
    var tabs = document.querySelectorAll('#priceTabs .tab');
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', function() {
            var allTabs = document.querySelectorAll('#priceTabs .tab');
            for (var j = 0; j < allTabs.length; j++) allTabs[j].classList.remove('tab--active');
            this.classList.add('tab--active');
            fetch('js/data.json')
                .then(function(r) { return r.json(); })
                .then(function(data) { renderPriceTable(data.prices, this.dataset.category); }.bind(this))
                .catch(function() {});
        });
    }
}

function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    }
}
