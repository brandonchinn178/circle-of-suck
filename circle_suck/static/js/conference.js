$(document).ready(function() {
    $("select.sport").chosen({
        placeholder_text_single: "Select",
        disable_search_threshold: 5,
    });
    $("select.conference").chosen({
        placeholder_text_single: "Select Value",
        disable_search_threshold: 5,
    });

    $("header select").change(function() {
        var sport = $("select.sport").val();
        var conference = $("select.conference").val();
        window.location = "/conference/?" + $.param({
            sport: sport,
            conference: conference,
        });
    });

    $(".circle-of-suck").each(function() {
        var n = $(this).children(".school").length;
        var radius = Math.min(250, 50 * (n-1));
        var svgSize = $("svg.school")[0].getBBox().width;

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
        .mouseover(function(e) {
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
});

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

    // TODO: add data to arrow
    var path = ["M", x1, y1, "L", x2, y2];
    $(school1).next("path.arrow").attr("d", path.join(" "));
}
