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
        var svgSize = $("svg.school").width();

        var size = 2 * radius + svgSize;
        var center = size/2;
        var offset = Math.PI/4; // treat 45deg as 0deg
        var angle = 2 * Math.PI / n;

        var prev = $(this).children(".school").last();
        $(this).children(".school").each(function(i) {
            var cx = center + Math.cos(angle * i + offset) * radius;
            var cy = center + Math.sin(angle * i + offset) * radius;
            $(this).css({
                left: cx - svgSize/2,
                top: cy - svgSize/2,
            });

            drawSchoolArrow(prev, this);
            prev = this;
        });

        $(this).css({
            width: size,
            height: size,
        });
    });

    $("svg.school circle")
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
    // centers of circles
    var radius = $("svg.school circle")[0].getBBox().width/2;
    var x1 = $(school1).find("circle").offset().left + radius;
    var y1 = $(school1).find("circle").offset().top + radius;
    var x2 = $(school2).find("circle").offset().left + radius;
    var y2 = $(school2).find("circle").offset().top + radius;

    // move arrow to edge of circles
    var ratio = radius / Math.hypot(x2 - x1, y2 - y1);
    x1 += ratio * (x2 - x1);
    y1 += ratio * (y2 - y1);
    x2 -= ratio * (x2 - x1);
    y2 -= ratio * (y2 - y1);

    drawArrow(x1, y1, x2, y2);
}

/**
 * Draw an SVG arrow from the given (x1,y1) coordinate to the given (x2,y2) coordinate
 *
 * Source: http://jsfiddle.net/Z5Qkf/2/
 */
function drawArrow(x1, y1, x2, y2) {
    var svg = $("<svg>").addClass("arrow");
    var head = $("<marker>")
        .attr("id", "head")
        .attr("orient", "auto")
        .attr("markerWidth", "4")
        .attr("markerHeight", "6")
        .attr("refX", "2")
        .attr("refY", "3");
    var headPath = $("<path>").attr("d", "M1,1 L3,3 L1,5").appendTo(head);
    $("<defs>").append(head).appendTo(svg);

    var deltaX = x2 - x1;
    var deltaY = y2 - y1;
    var width = deltaX === 0 ? 50 : Math.abs(deltaX);
    var height = deltaY === 0 ? 50 : Math.abs(deltaY);

    var corner = [x1, y1]; // the top left corner of the arrow
    var start = [0, 0]; // defaults start at top left corner
    var end = [deltaX, deltaY]; // defaults end at bottom right corner

    if (deltaX < 0) {
        corner[0] = x1 + deltaX;
        // needs to start at right corner
        start[0] = -deltaX;
        // needs to end at left corner
        end[0] = 0;
    }
    if (deltaY < 0) {
        corner[1] = y1 + deltaY;
        // needs to start at bottom corner
        start[1] = -deltaY;
        // needs to end at top corner
        end[1] = 0;
    }

    $("<path>")
        .addClass("arrow-body")
        .attr("marker-end", "url(#head)")
        // M <startX> <startY> L <endX> <endY>
        .attr("d", "M " + start[0] + " " + start[1] + " L " + end[0] + " " + end[1])
        .appendTo(svg);

    var viewBox = [-10, -10, width + 20, height + 20];
    svg.attr("viewBox", viewBox.join(" "))
        .css({
            left: corner[0],
            top: corner[1],
            width: width,
            height: height,
        });

    // just appending <svg> will not recognize it as an SVG
    // http://stackoverflow.com/a/23588413/4966649
    var container = $("<div>").append(svg);
    $(container.html()).appendTo(".graph");
}
