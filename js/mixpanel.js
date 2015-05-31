new (function() {
    "use strict";

    function init() {
        trackPageView();
        trackLinkClicks();
    }

    function trackPageView() {
        mixpanel.track('Page Viewed', {
            'Page Title' : document.title,
            'Page Url' : window.location.pathname
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
            'Link Title' : this.innerText,
            'Link Url' : this.href
        });
    }

    init();
})();