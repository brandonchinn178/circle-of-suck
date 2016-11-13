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
        var radius = 25 * n * 0.8;
        var svgSize = $("svg.school").width();

        var size = 2 * radius + svgSize;
        var center = size/2;
        var offset = Math.PI/4; // treat 45deg as 0deg
        var angle = 2 * Math.PI / n;

        $(this).children(".school").each(function(i) {
            var cx = center + Math.cos(angle * i + offset) * radius;
            var cy = center + Math.sin(angle * i + offset) * radius;
            $(this).css({
                left: cx - svgSize/2,
                top: cy - svgSize/2,
            });
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
