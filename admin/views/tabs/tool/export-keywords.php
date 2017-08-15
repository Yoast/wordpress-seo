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
<h2><?php __( 'Export keywords to a CSV file', 'wordpress-seo' ); ?></h2>
<form action="" method="post" accept-charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<?php
	wp_nonce_field( 'wpseo-export', '_wpnonce', true );
	$yform->set_options_value( 'export-post-title', true );
	$yform->checkbox( 'export-post-title', __( 'Export post title', 'wordpress-seo' ) );
	$yform->set_options_value( 'export-post-url', true );
	$yform->checkbox( 'export-post-url', __( 'Export post URL', 'wordpress-seo' ) );
	$yform->checkbox( 'export-seo-score', __( 'Export SEO score', 'wordpress-seo' ) );
	$yform->set_options_value( 'export-keywords', true );
	$yform->checkbox( 'export-keywords', __( 'Export keywords', 'wordpress-seo' ) );
	$yform->checkbox( 'export-keywords-score', __( 'Export keyword scores', 'wordpress-seo' ) );
	?>
	<input type="submit" class="button button-primary" name="export-posts" value="<?php echo __( 'Export keywords', 'wordpress-seo' ); ?>"/>
</form>
