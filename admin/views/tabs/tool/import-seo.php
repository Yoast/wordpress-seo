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
<p><?php _e( 'No doubt you\'ve used an SEO plugin before if this site isn\'t new. Let\'s make it easy on you, you can import the data below. If you want, you can import first, check if it was imported correctly, and then import &amp; delete. No duplicate data will be imported.', 'wordpress-seo' ); ?></p>

<p><?php printf( __( 'If you\'ve used another SEO plugin, try the %sSEO Data Transporter%s plugin to move your data into this plugin, it rocks!', 'wordpress-seo' ), '<a href="https://wordpress.org/plugins/seo-data-transporter/">', '</a>' ); ?></p>

<form
	action="<?php echo esc_attr( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-seo' ) ); ?>"
	method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php
	wp_nonce_field( 'wpseo-import', '_wpnonce', true, true );
	$yform->checkbox( 'importheadspace', __( 'Import from HeadSpace2?', 'wordpress-seo' ) );
	$yform->checkbox( 'importaioseo', __( 'Import from All-in-One SEO?', 'wordpress-seo' ) );
	$yform->checkbox( 'importwoo', __( 'Import from WooThemes SEO framework?', 'wordpress-seo' ) );
	$yform->checkbox( 'importwpseo', __( 'Import from wpSEO', 'wordpress-seo' ) );

	do_action( 'wpseo_import_other_plugins' );
	?>
	<br/>
	<?php
	$yform->checkbox( 'deleteolddata', __( 'Delete the old data after import? (recommended)', 'wordpress-seo' ) );
	?>
	<br/>
	<input type="submit" class="button button-primary" name="import"
	       value="<?php _e( 'Import', 'wordpress-seo' ); ?>"/>
</form>
