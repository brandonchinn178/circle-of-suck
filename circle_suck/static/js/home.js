$(document).ready(function() {
    $("select.conference").chosen({
        placeholder_text_single: "Select a Conference",
        disable_search_threshold: 5,
    }).change(checkSelection);
});

/**
 * Check if both selects have values, if so, redirect to the conference page
 */
function checkSelection() {
    var conference = $("select.conference").val();

    if (conference) {
        window.location = "?" + $.param({
            conference: conference,
        });
    }
}
