(jQuery( function() {

    //We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
    var current_page = jQuery(location).attr('pathname').split('/').pop();

    //If current page is edit.php, proceed.
    if (current_page == 'edit.php' ) {

        //When user clicks on save button after doing a quick edit, get the post id, current slug and new slug.
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

/**
 * Use notification counter so we can count how many times the function show_notification is called.
 *
 * @type {number}
 */
var notification_counter = 0;

/**
 * Show notification to user when there's a redirect created. When the response is empty, up the notification counter with 1, wait 100 ms and call function again.
 * Stop when the notification counter is bigger than 20.
 */
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