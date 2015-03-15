jQuery(document).ready(function () {
    jQuery('#export-button').click( function() {
        jQuery.post(ajaxurl, {
                action: 'wpseo_export',
                _wpnonce: wpseo_export_nonce,
                include_taxonomy: jQuery('#include_taxonomy_meta').is(':checked')
            }, function(resp) {
                resp = JSON.parse( resp );
                if (resp.url != undefined) {
                    window.location = resp.url;
                } else {
                    alert( resp.error );
                }
            }
        );
        event.preventDefault();
    });
});