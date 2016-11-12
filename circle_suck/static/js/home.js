$(document).ready(function() {
    $("select.sport").chosen({
        placeholder_text_single: "Select Sport",
        disable_search_threshold: 5,
    });
    $("select.conference").chosen({
        placeholder_text_single: "Select Conference",
        disable_search_threshold: 5,
    });
});
