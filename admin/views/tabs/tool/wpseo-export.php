<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?><p><?php
	/* translators: %1$s expands to Yoast SEO */
	printf( __( 'Export your %1$s settings here, to import them again later or to import them on another site.', 'wordpress-seo' ), 'Yoast SEO' );
	?></p>
<?php $yform->checkbox( 'include_taxonomy_meta', __( 'Include Taxonomy Metadata', 'wordpress-seo' ) ); ?><br/>
<button class="button-primary" id="export-button"><?php
	/* translators: %1$s expands to Yoast SEO */
	printf( __( 'Export your %1$s settings', 'wordpress-seo' ), 'Yoast SEO' );
	?></button>
<script>
	var wpseo_export_nonce = '<?php echo wp_create_nonce( 'wpseo-export' ); ?>';
</script>
