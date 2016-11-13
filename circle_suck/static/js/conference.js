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
 * Draw an SVG arrow from the given (x1,y1) coordinate to the given (x2,y2) coordinate
 *
 * Source: http://jsfiddle.net/Z5Qkf/2/
 */
function drawArrow(x1, y1, x2, y2) {
    var svg = $("<svg>")
        .attr("width", Math.abs(x2 - x1))
        .attr("height", Math.abs(y2 - y1))
        .addClass("arrow")
        .css({
            left: x1,
            top: y1,
        });
    var head = $("<marker>")
        .attr("id", "head")
        .attr("orient", "auto")
        .attr("markerWidth", "4")
        .attr("markerHeight", "6")
        .attr("refX", "3")
        .attr("refY", "3");
    var headPath = $("<path>").attr("d", "M1,1 L3,3 L1,5").appendTo(head);
    $("<defs>").append(head).appendTo(svg);
    $("<path>")
        .attr("marker-end", "url(#head)")
        .attr("d", "M0,0 L" + x2 + "," + y2)
        .appendTo(svg);

    // just appending <svg> will not recognize it as an SVG
    // http://stackoverflow.com/a/23588413/4966649
    var container = $("<div>").append(svg);
    $(container.html()).appendTo(".graph");
}
