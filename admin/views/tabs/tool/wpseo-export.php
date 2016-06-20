<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/* translators: %1$s expands to Yoast SEO */
$submit_button_value = sprintf( __( 'Export your %1$s settings', 'wordpress-seo' ), 'Yoast SEO' );

?><p><?php
	/* translators: %1$s expands to Yoast SEO */
	printf( __( 'Export your %1$s settings here, to import them again later or to import them on another site.', 'wordpress-seo' ), 'Yoast SEO' );
	?></p>
<form
	action="<?php echo esc_attr( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#wpseo-export' ) ); ?>"
	method="post"
	accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php $yform->checkbox( 'include_taxonomy_meta', __( 'Include Taxonomy Metadata', 'wordpress-seo' ) ); ?><br />
	<input type="hidden" name="export_nonce" value="<?php echo esc_attr( wp_create_nonce( 'wpseo-export' ) ); ?>" />
	<button name="yoast_export" value="1" type="submit" class="button-primary" id="export-button"><?php echo $submit_button_value; ?></button>
</form>
