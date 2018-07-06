<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Media
 *
 * @var Yoast_Form $yform
 */

$media_help = new WPSEO_Admin_Help_Panel(
	'search-appearance-media',
	__( 'Learn more about the Media and attachment URLs setting', 'wordpress-seo' ),
	__( 'When you upload media (an image or video for example) to WordPress, it doesn\'t just save the media, it creates an attachment URL for it. These attachment pages are quite empty: they contain the media item and maybe a title if you entered one. Because of that, if you never use these attachment URLs, it\'s better to disable them, and redirect them to the media item itself.', 'wordpress-seo' ),
	'has-wrapper'
);
?>
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

?>
<div id="media_settings">
	<br/>
	<br/>

	<?php
	$view_utils = new Yoast_View_Utils();
	$view_utils->show_post_type_settings( 'attachment', false );
	?>
</div>
