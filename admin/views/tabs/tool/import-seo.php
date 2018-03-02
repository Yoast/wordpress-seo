<?php
/**
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

$import_check = new WPSEO_Import_External_Detector();
$import_check->detect();

?>
<p><?php esc_html_e( 'No doubt you\'ve used an SEO plugin before if this site isn\'t new. Let\'s make it easy on you, you can import the data below. If you want, you can import first, check if it was imported correctly, and then import &amp; delete. No duplicate data will be imported.', 'wordpress-seo' ); ?></p>

<p>
	<?php
	printf(
		/* translators: 1: link open tag; 2: link close tag. */
		esc_html__( 'If you\'ve used another SEO plugin, try the %1$sSEO Data Transporter%2$s plugin to move your data into this plugin, it rocks!', 'wordpress-seo' ),
		'<a href="https://wordpress.org/plugins/seo-data-transporter/">',
		'</a>'
	);
	?>
</p>

<form action="<?php echo esc_url( admin_url( 'admin.php?page=wpseo_tools&tool=import-export#top#import-seo' ) ); ?>"
		method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php
	wp_nonce_field( 'wpseo-import', '_wpnonce', true, true );
	foreach ( $import_check->needs_import as $class => $plugin ) {
		$yform->checkbox( 'import_external[' . $class . ']', sprintf( __( 'Import from %s', 'wordpress-seo' ), $plugin ) );
	}

	do_action( 'wpseo_import_other_plugins' );
	?>
	<br/>
	<?php
	$yform->checkbox( 'deleteolddata', __( 'Delete the old data after import? (recommended)', 'wordpress-seo' ) );
	?>
	<br/>
	<input type="submit" class="button button-primary" name="import"
		   value="<?php esc_attr_e( 'Import', 'wordpress-seo' ); ?>"/>
</form>
