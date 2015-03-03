(jQuery( function() {

    //We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
    var current_page = jQuery(location).attr('pathname').split('/').pop();

    //If current page is edit.php, proceed.
    if (current_page == 'edit.php' ) {

        jQuery( '.button-primary' ).click(function() {
            var post_id = jQuery(this).closest('tr').attr('id').replace('edit-', '');

            var current_slug = jQuery( '#inline_' + post_id ).find('.post_name').html();

            var new_slug = jQuery("input[name=post_name]").val();

            if (current_slug != new_slug ) {
                show_notification();
            }
        });
    }
}));

var notification_counter = 0;

function show_notification() {
    jQuery.post(
        ajaxurl,
        { action: 'yoast_get_notifications'},
        function (response) {

            if ( response != '' ) {
                jQuery(response).insertAfter('h2');
                notification_counter = 0;
            } else if (notification_counter < 20 && response == '' ) {
                notification_counter++;
                setTimeout('show_notification()', 100);
            }
        });
}