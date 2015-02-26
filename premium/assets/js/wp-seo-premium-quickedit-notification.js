(jQuery( function() {

    //We want to show a redirect message when the slug is changed using quick edit. Therefore we need to get the current page.
    var current_page = jQuery(location).attr('pathname').split('/').pop();

    //If current page is edit.php, proceed.
    if (current_page == 'edit.php' ) {

        /**
         * The current known slug of the post that is being edited through quick edit
         */
        var current_slug;

        jQuery( '.editinline' ).click(function(evt) {
            //Get post_id of post that is being edited
            post_id = jQuery(this).closest('tr').attr('id').replace('post-', '');

            //Get current slug of post that is being edited
            current_slug = jQuery( '#inline_' + post_id ).find('.post_name').html();
        });

        jQuery( '.button-primary' ).click(function(evt) {
            //Get new slug of post that is being edited
            new_slug = jQuery("input[name=post_name]").val();

            //Check if current slug and new slug are not equal, if it isn't, display notification.
            if ( current_slug != new_slug ) {
                message = wpseoPremiumPostWatcher.yoast_quickedit_notification;

                //Replace quickedit-notification-old-url and quickedit-notification-new-url with right data

                jQuery('<div class="yoast-notice updated"><p>' + message + '</p></div>').insertAfter('h2');
            }
        });
    }
}));