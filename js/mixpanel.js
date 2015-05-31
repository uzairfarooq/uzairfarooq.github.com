new (function() {
    "use strict";

    function init() {
        trackPageView();
    }

    function trackPageView() {
        mixpanel.track('page viewed', {
            'page name' : document.title,
            'url' : window.location.pathname
        });
    }

    init();
})();