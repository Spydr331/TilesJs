// Create closure.
(function ($) {
    
    $.fn.jqTiles = function (options) {
        var defaults = {
            tile: "tile-img",
            text: "tile-text",
            content: ".tile-content",
            activeTile: "active",
            activeText: "active-text",
            activeSection: "active"
        };
        var opts = $.extend({}, defaults, options);
        
        return this.each(function () {
            
            var $section = $(this);
            var $tilesAndText = $section.find("." + opts.tile + ", ." + opts.text);
            var $tiles = $tilesAndText.filter("." + opts.tile);
            var $texts = $tilesAndText.filter("." + opts.text);
            var $spacer = $('<div class="tile-spacer"></div>');
            var index = -1;
            var $currentToShow = null;
            var $lastItem = null;
            var closing = false;
            var opening = false;
            var itemsAcross = 0;

            
            function whereToShowTile() {
                var tempIndex = index;
                var $last = $tiles.eq(tempIndex);
                var $test = $tiles.eq(tempIndex + 1);
                var t = $last.offset().top;

                if ($tiles.size() !== tempIndex + 1) {
                    while ($test !== null && $test.offset().top === t) {
                        tempIndex += 1;
                        $last = $test;
                        $test = $tiles.eq(tempIndex);

                        if ($tiles.size() <= tempIndex) { break; }

                        t = $last.offset().top;
                    }
                }

                return $last;
            }

            function showTile() {
                getItemsAcross();
                index = $texts.index($currentToShow);
                $lastItem = whereToShowTile($currentToShow);
                var h = $currentToShow.find(opts.content).outerHeight(true) + "px";

                var $newSpace = $spacer.clone();

                window.setTimeout(function () {
                    $currentToShow.css({
                        "height": h,
                        "top": $newSpace.position().top + "px"
                    });
                    $newSpace.css("height", h);
                }, 100);

                window.setTimeout(function () {
                    opening = false;
                }, 600);

                $lastItem.after($newSpace);
            }


            function getItemsAcross() {
                var testWidth = $tiles.eq(0).width();
                var winWidth = $(window).width();

                itemsAcross = Math.round(winWidth / testWidth);
            }

            function resize() {
                if (index >= 0) {
                    var checkRow = itemsAcross;
                    getItemsAcross();
                    if (checkRow !== itemsAcross) {
                        $tiles.removeClass(opts.activeTile);
                        $section.removeClass(opts.activeSection);
                        $texts.removeClass(opts.activeText);
                        closing = true;
                        $texts.css("opacity", 0);
                        $(".tile-spacer").hide();
                        hideTile();
                    } else {
                        var $currentSpacer = $(".tile-spacer");
                        var h = $currentToShow.find(opts.content).outerHeight(true) + "px";

                        $currentSpacer.css("height", h);
                        $currentToShow.css({
                            "height": h,
                            "top": $currentSpacer.position().top + "px"
                        });
                    }
                }
            }

            function hideTile() {
                $texts.css({
                    "height": ''
                });
                if (index >= 0) {
                    index = -1;
                    $currentToShow = null;
                    $lastItem = null;
                    var $spacers = $(".tile-spacer");
                    $spacers.css("height", '');
                    window.setTimeout(function () {
                        $spacers.remove();
                        $texts.css("opacity", 0);
                    }, 600);
                }

                index = -1;
                $texts.css("opacity", 1);
                window.setTimeout(function () {
                    closing = false;
                }, 600);
                window.setTimeout(function () {
                    if (!$texts.hasClass(opts.activeText)) {
                        $texts.css("opacity", 0);
                    } else {
                        $texts.css("opacity", 1);
                    }
                }, 605);

            }


            $tiles.on('click', function (e) {
                e.preventDefault();
                var $click = $(this);
                if (!closing && !opening) {
                    var ind = $tilesAndText.index($click);
                    var indTile = $tiles.index($click);
                    $tiles.removeClass(opts.activeTile);
                    $section.removeClass(opts.activeSection);
                    $texts.removeClass(opts.activeText);
                    closing = true;

                    var isOpened = (index === indTile);
                    var openSpeed = index >= 0 ? 600 : 0;
                    hideTile();


                    if (!isOpened) {
                        opening = true;
                        $section.addClass(opts.activeSection);
                        $click.addClass(opts.activeTile);
                        $texts.addClass(opts.activeText);
                        window.setTimeout(function () {
                            $currentToShow = $tilesAndText.eq(ind + 1);
                            showTile();
                        }, openSpeed);
                    }
                }

            });
            
            $(window).resize(function () {
                resize();
            });

        });

    };
    // ...
 
// End of closure.
 
})(jQuery);
