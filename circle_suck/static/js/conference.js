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
 * Set the SVG arrow between the two schools
 */
function setArrow(school1, school2) {
    // center of circles
    var x1 = $(school1).position().left + $(school1).width() / 2;
    var y1 = $(school1).position().top + $(school1).height() / 2;
    var x2 = $(school2).position().left + $(school2).width() / 2;
    var y2 = $(school2).position().top + $(school2).height() / 2;
    var radius = $(school1).find("circle")[0].getBBox().width / 2;

    // move to outside of circle
    var ratio = radius / Math.hypot(x2-x1, y2-y1);
    x1 += ratio * (x2 - x1);
    y1 += ratio * (y2 - y1);
    x2 -= ratio * (x2 - x1);
    y2 -= ratio * (y2 - y1);
    var width = x2 - x1;
    var height = y2 - y1;

    var container = $(school1).parent();
    var arrow = $(school1).next("svg.arrow");
    arrow.css({
        width: Math.abs(width),
        height: Math.abs(height),
        left: x1 - container.position().left,
        top: y1 - container.position().top,
    });
    arrow.find(".arrow-body").attr("d", "M0,0 L" + width + "," + height);
}
