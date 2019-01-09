<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! defined( 'WPSEO_NAMESPACES' ) || ! WPSEO_NAMESPACES ) {
	esc_html_e( 'Import of settings is only supported on servers that run PHP 5.3 or higher.', 'wordpress-seo' );
	return;
}
?>
<p>
	<?php
	printf(
		/* translators: 1: Import settings button string from below. */
		esc_html__( 'Import settings by pasting the settings you copied from another site here and clicking "%s".', 'wordpress-seo' ),
		esc_html__( 'Import settings', 'wordpress-seo' )
	);
	?>
</p>

<form
	action="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#wpseo-import' ) ); ?>"
	method="post"
	accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php wp_nonce_field( WPSEO_Import_Settings::NONCE_ACTION ); ?>
	<label class="screen-reader-text" for="settings-import"><?php esc_html_e( 'Paste your settings from another Yoast SEO installation.', 'wordpress-seo' ); ?></label>
	<textarea id="settings-import" rows="10" cols="140" name="settings_import"></textarea><br/>
	<input type="submit" class="button button-primary" value="<?php esc_attr_e( 'Import settings', 'wordpress-seo' ); ?>"/>
</form>
