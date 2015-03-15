/* jshint strict:true */
/* global ajaxurl */
/* global wpseo_export_nonce */
jQuery(document).ready(function () {
    "use strict";
    jQuery('#export-button').click( function() {
        jQuery.post(ajaxurl, {
                action: 'wpseo_export',
                _wpnonce: wpseo_export_nonce,
                include_taxonomy: jQuery('#include_taxonomy_meta').is(':checked')
            }, function(resp) {
                resp = JSON.parse( resp );
                if (resp.url !== undefined) {
                    window.location = resp.url;
                } else {
                    jQuery( '#wpseo-title').append( '<div class="error settings-error"><p>' + resp.error + '</p></div>' );
                }
            }
        );
        event.preventDefault();
    });
});