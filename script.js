$(document).ready(function () {

    // 1. Анимированные цифры (главная)
    let started = false;
    function runCounters() {
        $(".count").each(function () {
            const $el = $(this), target = parseInt($el.data("count"), 10);
            $({ v: 0 }).animate({ v: target }, { duration: 1800,
                step: function (now) { $el.text(Math.floor(now)); },
                complete: function () { $el.text(target); } });
        });
    }
    function checkCounters() {
        const $s = $(".stats");
        if (!started && $s.length && $(window).scrollTop() + $(window).height() > $s.offset().top + 50) {
            started = true;
            runCounters();
        }
    }
    $(window).on("scroll", checkCounters);
    checkCounters();

    // 2. Валидация форм (класс needs-validation)
    $(".needs-validation").on("submit", function (e) {
        e.preventDefault();
        this.classList.add("was-validated");
        const ok = $(this).find(".form-success");
        if (this.checkValidity()) {
            this.reset();
            this.classList.remove("was-validated");
            ok.hide().fadeIn(500);
        } else {
            ok.hide();
        }
    });
    $(".needs-validation").on("reset", function () {
        this.classList.remove("was-validated");
        $(this).find(".form-success").hide();
    });

    // 3. Аккордеон (Услуги)
    $(".accordion-header").click(function () {
        const body = $(this).next(".accordion-body");
        $(".accordion-body").not(body).slideUp(300);
        $(".accordion-header").not(this).removeClass("open");
        body.slideToggle(300);
        $(this).toggleClass("open");
    });

    // 4. Кнопка «Наверх»
    $("body").append('<button id="backToTop" type="button" aria-label="Top">&uarr;</button>');
    $(window).on("scroll", function () {
        $("#backToTop")[$(this).scrollTop() > 300 ? "fadeIn" : "fadeOut"](300);
    });
    $("#backToTop").on("click", function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
    });

    // 5. Команда из team.json
    let team = [], current = localStorage.getItem("lang") || "ru";
    function renderTeam(lang) {
        if (!$("#teamList").length || !team.length) { return; }
        $("#teamList").html(team.map(function (m) {
            return '<div class="col-12 col-sm-6 col-lg-4"><div class="card h-100 text-center team-card"><div class="card-body">' +
                '<img src="' + m.photo + '" alt="' + m.name[lang] + '" class="rounded-circle mb-3">' +
                '<h2 class="h5">' + m.name[lang] + '</h2><p class="text-muted mb-1">' + m.role[lang] +
                '</p><p class="small mb-0">' + m.bio[lang] + '</p></div></div></div>';
        }).join(""));
    }
    $.getJSON("team.json", function (data) { team = data; renderTeam(current); })
        .fail(function () { console.log("team.json не загрузился. Открой сайт через Live Server."); });

    // 6. Мультиязычность из lang.json (RU / KK / EN), выбор в localStorage
    let tr = {};
    function applyLanguage(lang) {
        if (!tr[lang]) { return; }
        current = lang;
        $("[data-i18n]").each(function () {
            const v = tr[lang][$(this).attr("data-i18n")];
            if (v !== undefined) { $(this).text(v); }
        });
        document.documentElement.lang = lang;
        $(".lang-btn").removeClass("active");
        $('.lang-btn[data-lang="' + lang + '"]').addClass("active");
        localStorage.setItem("lang", lang);
        renderTeam(lang);
    }
    $.getJSON("lang.json", function (data) {
        tr = data;
        applyLanguage(tr[current] ? current : "ru");
    }).fail(function () { console.log("lang.json не загрузился. Открой сайт через Live Server."); });
    $(".lang-btn").on("click", function () { applyLanguage($(this).attr("data-lang")); });

});