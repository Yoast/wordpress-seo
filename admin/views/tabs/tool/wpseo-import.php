<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

?>
<p><?php _e( 'Import settings by locating <em>settings.zip</em> and clicking "Import settings"', 'wordpress-seo' ); ?></p>

<form
	action="<?php echo esc_attr( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#wpseo-import' ) ); ?>"
	method="post" enctype="multipart/form-data"
	accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php wp_nonce_field( 'wpseo-import-file', '_wpnonce', true, true ); ?>
	<label class="screen-reader-text" for="settings-import-file"><?php _e( 'Choose your settings.zip file', 'wordpress-seo' ); ?></label>
	<input type="file" name="settings_import_file" id="settings-import-file"
	       accept="application/x-zip,application/x-zip-compressed,application/zip"/>
	<input type="hidden" name="action" value="wp_handle_upload"/><br/>
	<br/>
	<input type="submit" class="button button-primary" value="<?php _e( 'Import settings', 'wordpress-seo' ); ?>"/>
</form>
