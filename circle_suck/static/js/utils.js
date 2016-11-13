var SVG_RADIUS;

$(document).ready(function() {
    SVG_RADIUS = $(".school:visible")[0].getBBox().width / 2 + 10;
});

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
 * Arrange the schools in the given container in a polygon formation.
 */
function arrangeSchools(container) {
    var n = $(container).find(".school").length;
    var radius = Math.min(300, 75 * (n - 1));
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
    var x1 = parseInt($(school1).attr("x")) + SVG_RADIUS;
    var y1 = parseInt($(school1).attr("y")) + SVG_RADIUS;
    var x2 = parseInt($(school2).attr("x")) + SVG_RADIUS;
    var y2 = parseInt($(school2).attr("y")) + SVG_RADIUS;

    // move arrow to edge of circles, manual adjustments
    var hyp = Math.hypot(x2 - x1, y2 - y1);
    x1 += (SVG_RADIUS / hyp) * (x2 - x1);
    y1 += (SVG_RADIUS / hyp) * (y2 - y1);
    x2 -= ((SVG_RADIUS + 25) / hyp) * (x2 - x1);
    y2 -= ((SVG_RADIUS + 25) / hyp) * (y2 - y1);

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
