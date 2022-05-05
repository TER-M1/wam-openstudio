

function scrollSync(selector) {
    let active = null;
    document.querySelectorAll(selector).forEach(function(element) {
        element.addEventListener("mouseenter", function(e) {
            active = e.target;
        });

        element.addEventListener("scroll", function(e) {
            if (e.target !== active) return;

            document.querySelectorAll(selector).forEach(function(target) {
                if (active === target) return;

                target.scrollTop = active.scrollTop;
                target.scrollLeft = active.scrollLeft;
            });
        });
    });
}

scrollSync(".scroll-sync");

$('.ui.dropdown.settings-menu').dropdown({
    action: 'hide',
});



