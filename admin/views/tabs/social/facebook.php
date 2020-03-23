<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . esc_html__( 'Facebook settings', 'wordpress-seo' ) . '</h2>';

$yform->light_switch( 'opengraph', __( 'Add Open Graph meta data', 'wordpress-seo' ) );

?>
	<p>
		<?php
			esc_html_e( 'Enable this feature if you want Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.', 'wordpress-seo' );
		?>
	</p>

<div id="wpseo-opengraph-settings" style="display: none;">
<?php

$yform->textinput( 'fbadminapp', __( 'Facebook App ID', 'wordpress-seo' ) );

if ( get_option( 'show_on_front' ) === 'posts' ) {
	$social_facebook_frontpage_help = new WPSEO_Admin_Help_Button(
		'https://yoa.st/3yp',
		esc_html__( 'Learn more about the title separator setting', 'wordpress-seo' )
	);
	echo '<h2 class="help-button-inline">' . esc_html__( 'Frontpage settings', 'wordpress-seo' ) . $social_facebook_frontpage_help . '</h2>';

	$yform->media_input( 'og_frontpage_image', __( 'Image URL', 'wordpress-seo' ) );
	$yform->textinput( 'og_frontpage_title', __( 'Title', 'wordpress-seo' ) );
	$yform->textinput( 'og_frontpage_desc', __( 'Description', 'wordpress-seo' ) );

	$copy_home_description_button_label = esc_html__( 'Copy home meta description', 'wordpress-seo' );

	// Offer copying of meta description.
	$homepage_meta_description = WPSEO_Options::get( 'metadesc-home-wpseo' );
	if ( ! empty( $homepage_meta_description ) ) {
		$copy_home_meta_desc_help = new WPSEO_Admin_Help_Button(
			'https://yoa.st/3yp',
			esc_html__( 'Help on copying the home meta description', 'wordpress-seo' )
		);

		echo '<input type="hidden" id="meta_description" value="', esc_attr( $homepage_meta_description ), '" />';
		echo '<div class="label desc copy-home-meta-description">',
			 '<button type="button" id="copy-home-meta-description" class="button">', $copy_home_description_button_label, '</button>',
			 $copy_home_meta_desc_help,
			 '</div>';
	}
}

echo '<h2>' . esc_html__( 'Default settings', 'wordpress-seo' ) . '</h2>';

$yform->media_input( 'og_default_image', __( 'Image URL', 'wordpress-seo' ) );

?>
	<p class="desc label">
		<?php esc_html_e( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ); ?>
	</p>
</div>
<?php

do_action( 'wpseo_admin_opengraph_section' );
