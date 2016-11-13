// map school to all games lost
var loserToGames;
// maps school to all schools who played it
var playedSchools;

$(document).ready(function() {
    $("header select.sport").chosen({
        placeholder_text_single: "---",
        disable_search_threshold: 5,
    });

    $("header select.conference").chosen({
        placeholder_text_single: "---",
        disable_search_threshold: 5,
    });

    $("header select").change(function() {
        var sport = $("select.sport").val();
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

    $(".circle-of-suck").each(function() {
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
        // all schools who have not played hovered school fade away
        var havePlayed = playedSchools[id];
        $.each(window.allSchools, function(school) {
            if (havePlayed.indexOf(school) === -1) {
                fadeElement(".school." + school);
            }
        });
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

    $(".suck-graph .arrow").mouseover(function() {
        fadeElement(".suck-graph .school");
        fadeElement(".suck-graph .arrow");
        fadeElement(this, true);
        var prev = $(this).prev(); // can never be nothing
        var next = $(this).next();
        if (next.length === 0) {
            next = $(this).parents(".circle-of-suck").find(".school:first");
        }
        fadeElement(prev, true);
        fadeElement(next, true);
    });

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

/*** UTILITY FUNCTIONS ***/

/**
 * Fade out the given element (school or arrow), since we can't add/remove
 * classes to SVG elements.
 */
function fadeElement(element, undo) {
    if ($(element).is(".school")) {
        var opacity = undo ? "0" : "0.6";
        var stroke = undo ? "#577580" : "#8CA7B1";
        $(element).find("circle").css({
            fill: "rgba(255,255,255," + opacity + ")",
            stroke: stroke,
        });
    } else {
        var stroke = undo ? "#EB8181" : "#F2ADAD";
        $(element).find("path").css("stroke", stroke);
    }
}

/**
 * Return parameters for the URL, including sport, conference, and year
 */
function getURLParams() {
    return $.param({
        sport: $("select.sport").val(),
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
 * Arrange the schools in the given container in a polygon formation.
 */
function arrangeSchools(container) {
    var n = $(container).find(".school").length;
    var radius = Math.min(250, 50 * (n - 1));
    var svgSize = $("svg.school")[0].getBBox().width + 20;

    var size = 2 * radius + svgSize;
    var center = size/2;
    var offset = Math.PI/4; // treat 45deg as 0deg
    var angle = 2 * Math.PI / n;

    $(container).find(".school").each(function(i) {
        var cx = center + Math.cos(angle * i + offset) * radius;
        var cy = center + Math.sin(angle * i + offset) * radius;
        $(this)
            .attr("x", cx - svgSize/2)
            .attr("y", cy - svgSize/2);
    });

    $(container).css({
        width: size,
        height: size,
    });
}

/**
 * Draw an SVG arrow from the given svg.school to the other svg.school
 */
function drawSchoolArrow(school1, school2, arrow) {
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

    arrow
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
