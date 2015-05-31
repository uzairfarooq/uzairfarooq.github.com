new (function() {
    "use strict";

    function init() {
        trackPageView();
        trackLinkClicks();
    }

    function trackPageView() {
        mixpanel.track('Page Viewed', {
            'Title' : document.title,
            'Url' : window.location.pathname
        });
    }

    function trackLinkClicks() {
        var anchors = document.getElementsByTagName("a");

        for (var i = 0; i < anchors.length ; i++) {
            anchors[i].addEventListener("click", linkClicked);
        }
    }

    function linkClicked() {
        mixpanel.track('Link Clicked', {
            'Title' : this.innerText,
            'Url' : this.href
        });
    }

    init();
})();