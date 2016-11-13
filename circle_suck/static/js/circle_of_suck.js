// map school to all games lost
var loserToGames;

$(document).ready(function() {

    $("header select.conference").chosen({
        placeholder_text_single: "---",
        disable_search_threshold: 5,
    });

    $("header select").change(function() {
        var conference = $("select.conference").val();
        window.search = getURLParams();
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
    loserToGames = {};
    if (window.allGames) {
        for (var i = 0; i < window.allGames.length; i++) {
            var game = window.allGames[i];
            var gamesLost = loserToGames[game.loser];
            if (gamesLost) {
                gamesLost.push(game);
            } else {
                loserToGames[game.loser] = [game];
            }
        }
    }

    $(".circle-of-suck").each(function() {
        var n = $(this).children(".school").length;
        var radius = Math.min(250, 50 * (n-1));
        var svgSize = $("svg.school")[0].getBBox().width + 20;

        var size = 2 * radius + svgSize;
        var center = size/2;
        var offset = Math.PI/4; // treat 45deg as 0deg
        var angle = 2 * Math.PI / n;

        var prev = $();
        $(this).children(".school").each(function(i) {
            var cx = center + Math.cos(angle * i + offset) * radius;
            var cy = center + Math.sin(angle * i + offset) * radius;
            $(this)
                .attr("x", cx - svgSize/2)
                .attr("y", cy - svgSize/2);

            if (prev.length !== 0) {
                drawSchoolArrow(prev, this);
            }
            prev = this;
        });
        drawSchoolArrow(prev, $(this).children(".school:first"));

        $(this).css({
            width: size,
            height: size,
        });
    });

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
        });

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
        })
        .mousemove(function(e) {
            $(".game-box").css({
                top: e.pageY + 10,
                left: e.pageX + 10,
            });
        })
        .mouseleave(function() {
            $(".game-box").hide();
        });
}

/**
 * Return parameters for the URL, including conference and year
 */
function getURLParams() {
    return $.param({
        conference: $("select.conference").val(),
        year: window.currYear,
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

/**
 * Draw an SVG arrow from the given svg.school to the other svg.school
 */
function drawSchoolArrow(school1, school2) {
    // centers of svg
    var radius = $(school1)[0].getBBox().width / 2 + 10;
    var x1 = parseInt($(school1).attr("x")) + radius;
    var y1 = parseInt($(school1).attr("y")) + radius;
    var x2 = parseInt($(school2).attr("x")) + radius;
    var y2 = parseInt($(school2).attr("y")) + radius;

    // move arrow to edge of circles, manual adjustments
    var hyp = Math.hypot(x2 - x1, y2 - y1);
    x1 += (radius / hyp) * (x2 - x1);
    y1 += (radius / hyp) * (y2 - y1);
    x2 -= ((radius + 25) / hyp) * (x2 - x1);
    y2 -= ((radius + 25) / hyp) * (y2 - y1);

    var school1Id = $(school1).data("id");
    var school2Id = $(school2).data("id");
    var lostGames = loserToGames[school1Id] || [];
    var game = lostGames.filter(function(game) {
        return game.winner === school2Id;
    });

    if (game.length === 0) {
        game = null;
    } else {
        game = game[0];
    }

    var arrow = $(school1).next(".arrow")
        .data("game-details", game)
        .data("loser", $(school1))
        .data("winner", $(school2));

    var path = ["M", x1, y1, "L", x2, y2];
    arrow.find("path.arrow-body")
        .attr("d", path.join(" "));
    arrow.find("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
}
