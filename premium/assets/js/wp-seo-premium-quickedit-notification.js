(jQuery( function() {

    //We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
    var current_page = jQuery(location).attr('pathname').split('/').pop();

    //If current page is edit.php, proceed.
    if (current_page == 'edit.php' ) {

        /**
         * The current known slug of the post that is being edited through quick edit
         */
        var current_slug;

        jQuery( '.editinline' ).click( function(e) {
            //Get post_id of post that is being edited
            var post_id = jQuery(this).closest('tr').attr('id').replace('post-', '');

            //Get current slug of post that is being edited
            current_slug = jQuery( '#inline_' + post_id ).find('.post_name').html();
        });

        jQuery( '.button-primary' ).click(function() {

            //Get new slug of post that is being edited

            //current_slug = jQuery( '#inline_' + post_id ).find('.post_name').html();

            var post_id = jQuery(this).closest('tr').attr('id').replace('edit-', '');

            current_slug = jQuery( '#inline_' + post_id ).find('.post_name').html();

            var new_slug = jQuery("input[name=post_name]").val();

            if (current_slug != new_slug ) {
                show_notification();
            }
        });
    }}));

function show_notification(){
    jQuery.post(
        ajaxurl,
        { action: 'yoast_get_notifications'},
        function (response) {

            if ( response != '' ) {

                jQuery(response).insertAfter('h2');
            } else {
                setTimeout('show_notification()', 100);
            }
        });
}