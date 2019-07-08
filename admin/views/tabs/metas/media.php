<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$wpseo_media_presenter = new WPSEO_Paper_Presenter(
	esc_html__( 'Media & attachment URLs', 'wordpress-seo' ),
	dirname( __FILE__ ) . '/paper-content/media-content.php',
	array(
		'help_text' => new WPSEO_Admin_Help_Panel(
			'search-appearance-media',
			__( 'Learn more about the Media and attachment URLs setting', 'wordpress-seo' ),
			__( 'When you upload media (an image or video for example) to WordPress, it doesn\'t just save the media, it creates an attachment URL for it. These attachment pages are quite empty: they contain the media item and maybe a title if you entered one. Because of that, if you never use these attachment URLs, it\'s better to disable them, and redirect them to the media item itself.', 'wordpress-seo' ),
			'has-wrapper'
		),
		'paper_id'  => 'settings-media-attachment-url',
	)
);

echo $wpseo_media_presenter->get_output();
