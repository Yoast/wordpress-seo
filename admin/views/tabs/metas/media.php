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
?>
	<h2><?php esc_html_e( 'Media & attachment URLs', 'wordpress-seo' ); ?></h2>
	<p>
		<?php esc_html_e( 'When you upload media (an image or video for example) to WordPress, it doesn\'t just save the media, it creates an attachment URL for it.', 'wordpress-seo' ); ?>
		<?php esc_html_e( 'These attachment pages are quite empty: they contain the media item and maybe a title if you entered one.', 'wordpress-seo' ); ?>
		<?php esc_html_e( 'Because of that, if you never use these attachment URLs, it\'s better to disable them, and redirect them to the media item itself.', 'wordpress-seo' ); ?>
	</p>
<?php

$yform->toggle_switch( 'disable-attachment', array(
	'on' => __( 'Yes', 'wordpress-seo' ),
	'off'  => __( 'No', 'wordpress-seo' ),
), __( 'Redirect attachment URLs to the attachment itself?', 'wordpress-seo' ) );

?>
	<div id="media_settings">
		<br/>
		<br/>

		<?php
		$view_utils = new Yoast_View_Utils();
		$view_utils->show_post_type_settings( 'attachment' ); ?>
	</div>
