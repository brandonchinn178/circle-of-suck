// map school to all games lost
var loserToGames;
// maps school to all schools who played it
var playedSchools;

$(document).ready(function() {

    $("header select.conference").chosen({
        placeholder_text_single: "---",
        disable_search_threshold: 5,
    });

    $("header select").change(function() {
        window.location.search = getURLParams();
    });

    window.currYear = parseInt($(".year span").text());
    if (window.currYear >= new Date().getFullYear()) {
        $(".year .increment").addClass("disabled");
    }

    $(".year a").click(function() {
        if ($(this).hasClass("disabled")) {
            return false;
        }
        // disable arrows
        $(".year a").addClass("disabled");

        if ($(this).hasClass("increment")) {
            window.currYear++;
        } else {
            window.currYear--;
        }
        // load next year's circle of suck
        activateYear(true);
        return false;
    });

    initCircleOfSuck();

    // when pressing the back button, check to see if it's a year we loaded
    // by AJAX
    $(window).on("popstate", function(e) {
        var state = e.originalEvent.state;
        if (state) {
            window.currYear = state.year;
            activateYear(false);
        }
    });
});

function initCircleOfSuck() {
    // initialize helper objects
    loserToGames = {};
    playedSchools = {};
    $.each(window.allSchools, function(school) {
        loserToGames[school] = [];
        playedSchools[school] = [];
    });
    if (window.allGames) {
        for (var i = 0; i < window.allGames.length; i++) {
            var game = window.allGames[i];
            loserToGames[game.loser].push(game);
            playedSchools[game.loser].push(game.winner);
            playedSchools[game.winner].push(game.loser);
        }
    }

    // set up circle graph
    $(".suck-graph .circle-of-suck").each(function() {
        arrangeSchools(this);

        var prev = $(this).children(".school").last();
        $(this).children(".school").each(function() {
            var arrow = $(prev).next(".arrow");
            drawSchoolArrow(prev, this, arrow);
            prev = this;
        })
    });

    // set up full graph
    var svg = $(".full-graph svg");
    $(".suck-graph svg.school").clone().appendTo(svg);
    arrangeSchools(svg);

    var arrow = $(".arrow:first").clone();
    window.allGames.forEach(function(game) {
        var winner = svg.find(".school." + game.winner);
        var loser = svg.find(".school." + game.loser);
        var _arrow = arrow.clone().appendTo(svg);
        drawSchoolArrow(loser, winner, _arrow);
    });

    // initialize popup boxes for school details
    $(".school circle")
        .mouseover(function() {
            var id = $(this).parent().data("id");
            var data = window.allSchools[id];
            $(".school-box .school-name").text(data.name);
            $(".school-box .record").text("(" + data.record[0] + "-" + data.record[1] + ")");
            $(".school-box").show();
        })
        .mousemove(function(e) {
            $(".school-box").css({
                top: e.pageY + 10,
                left: e.pageX + 10,
            });
        })
        .mouseleave(function() {
            $(".school-box").hide();
            fadeElement(".school", true);
            fadeElement(".arrow", true);
        });

    $(".suck-graph .school circle").mouseover(function() {
        fadeElement(".suck-graph .school");
        fadeElement(".suck-graph .arrow");
        var school = $(this).parent();
        fadeElement(school, true);

        var circle = $(this).parents(".circle-of-suck");
        if (circle.length !== 0) {
            var prev = $(school).prevAll(".school").first();
            var next = $(school).nextAll(".school").first();
            if (prev.length === 0) {
                prev = circle.find(".school:last");
            }
            if (next.length === 0) {
                next = circle.find(".school:first");
            }
            fadeElement(prev, true);
            fadeElement(prev.next(".arrow"), true);
            fadeElement(next, true);
            fadeElement(next.prev(".arrow"), true);
        }
    });

    $(".full-graph .school circle").mouseover(function() {
        fadeElement(".full-graph .arrow");
        // all schools who have not played the hovered school fade away
        var school = $(this).parent();
        var id = school.data("id");
        var havePlayed = playedSchools[id];
        $.each(window.allSchools, function(school) {
            if (havePlayed.indexOf(school) === -1) {
                fadeElement(".school." + school);
            }
        });

        fadeElement(school, true);
        $(".full-graph .arrow").each(function() {
            var game = $(this).data("gameDetails");
            if (game.winner === id || game.loser === id) {
                fadeElement(this, true);
            }
        });
    });

    // initialize popup boxes for game details
    $(".arrow")
        .mouseover(function() {
            var game = $(this).data("game-details");
            if (game === null) {
                return;
            }
            var loser = $(this).data("loser");
            var winner = $(this).data("winner");
            $(".game-box .date").text(game.date);
            $(".game-box .winner .logo img").attr("src", winner.find("image").attr("href"));
            $(".game-box .winner .score").text(game.winner_score);
            $(".game-box .loser .logo img").attr("src", loser.find("image").attr("href"));
            $(".game-box .loser .score").text(game.loser_score);
            $(".game-box").show();

            fadeElement(".school");
            fadeElement(".arrow");
            fadeElement(this, true);

            fadeElement($(this).data("loser"), true);
            fadeElement($(this).data("winner"), true);
        })
        .mousemove(function(e) {
            $(".game-box").css({
                top: e.pageY + 10,
                left: e.pageX + 10,
            });
        })
        .mouseleave(function() {
            $(".game-box").hide();
            fadeElement(".school", true);
            fadeElement(".arrow", true);
        });

    // initialize toggle graph button
    $(".toggle-graph").click(function() {
        if ($(".suck-graph").is(":visible")) {
            var fadeOut = ".suck-graph";
            var fadeIn = ".full-graph";
            var text = "Circle Graph";
        } else {
            var fadeOut = ".full-graph";
            var fadeIn = ".suck-graph";
            var text = "Full Graph";
        }

        $(this).text(text);
        $(fadeOut).fadeOut(function() {
            $(fadeIn).fadeIn();
        });
    });
}

/**
 * Show the circle of suck for the year window.currYear. If pushHistory
 * is true, update the URL. Otherwise, don't.
 */
function activateYear(pushHistory) {
    $(".year span").text(window.currYear);
    $.ajax("?" + getURLParams(), {
        success: function(data) {
            $(".year a").removeClass("disabled");
            if (window.currYear >= new Date().getFullYear()) {
                $(".year .increment").addClass("disabled");
            }

            // update URL
            if (pushHistory) {
                history.pushState({year: window.currYear}, "", "?" + getURLParams());
            }

            // repopulate HTML
            $(".content > *:not(.year)").remove();
            var html = $(data);
            var toAdd = html.filter(".content").children().not(".year");
            toAdd.css("opacity", 0)
                .animate({opacity: 1}, 500)
                .appendTo(".content");

            // re-set the window variables from <script> tags
            var js = html.filter("script.season-information").text();
            eval(js);

            initCircleOfSuck();
        },
        error: function() {
            alert("An error occurred.");
        },
    });
}
