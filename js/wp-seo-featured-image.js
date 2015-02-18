jQuery(document).ready(function () {
    var featuredImage = wp.media.featuredImage.frame();
    featuredImage.on('select', function () {
        yst_checkFeaturedImage(featuredImage);
    });
});

function yst_checkFeaturedImage( featuredImage ) {
    var attachment = featuredImage.state().get('selection').first().toJSON();

    if ( attachment.width < 200 || attachment.height < 200 ) {
        //Show warning to user and do not add image to OG
        if ( ! document.getElementById( 'yst_opengraph_image_warning' ) ) {
            jQuery('<div id="yst_opengraph_image_warning"><p>' + wpseoMetaboxL10n.featured_image_notice + '</p></div>').insertBefore('#postimagediv');
            document.getElementById('postimagediv').style.border = '1px solid #FF6600';
        }
    }

    if ( attachment.width > 199 && attachment.height > 199 && document.getElementById( 'yst_opengraph_image_warning' ) ) {
        jQuery( '#yst_opengraph_image_warning').remove();
        document.getElementById('postimagediv').style.border = 'none';
    }
}