$(document).ready(function() {
    $("select.sport").chosen({
        placeholder_text_single: "Select Sport",
        disable_search_threshold: 5,
    }).change(checkSelection);
    $("select.conference").chosen({
        placeholder_text_single: "Select Conference",
        disable_search_threshold: 5,
    }).change(checkSelection);
});

/**
 * Check if both selects have values, if so, redirect to the conference page
 */
function checkSelection() {
    var sport = $("select.sport").val();
    var conference = $("select.conference").val();

    if (sport && conference) {
        window.location = "/conference/?" + $.param({
            sport: sport,
            conference: conference,
        });
    }
}
