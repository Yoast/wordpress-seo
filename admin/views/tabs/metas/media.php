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

$media_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-media',
	__( 'Learn more about the Media and attachment URLs setting', 'wordpress-seo' ),
	__( 'When you upload media (an image or video for example) to WordPress, it doesn\'t just save the media, it creates an attachment URL for it. These attachment pages are quite empty: they contain the media item and maybe a title if you entered one. Because of that, if you never use these attachment URLs, it\'s better to disable them, and redirect them to the media item itself.', 'wordpress-seo' ),
	'has-wrapper'
);
?>
	<h2 class="help-button-inline"><?php echo esc_html__( 'Media & attachment URLs', 'wordpress-seo' ) . $media_help->get_button_html(); ?></h2>
	<?php echo $media_help->get_panel_html(); ?>
	<p><strong><?php esc_html_e( 'We recommend you set this to Yes.', 'wordpress-seo' ); ?></strong></p>

<?php

$yform->toggle_switch(
	'disable-attachment',
	array(
		'on'  => __( 'Yes', 'wordpress-seo' ),
		'off' => __( 'No', 'wordpress-seo' ),
	),
	__( 'Redirect attachment URLs to the attachment itself?', 'wordpress-seo' )
);

if ( $yform->options['disable-attachment'] === 'off' ) {
	?>
	<div class="notice notice-warning is-dismissible" >
		<p><?php _e( 'Your website is configured to show \'attachment\' pages for the images and media you\'ve uploaded. In most cases, this can be harmful to your SEO. We generally recommend hiding these pages by enabling the "Redirect attachment URLs to the attachment itself" option in our \'Media\' settings tab.', 'wordpress-seo' ); ?></p>
	</div>
	<?php
}

?>
	<div id="media_settings">
		<br/>
		<br/>

		<?php
		$view_utils = new Yoast_View_Utils();
		$view_utils->show_post_type_settings( 'attachment' );
		?>
	</div>
