<?php
/**
 * @package WPSEO\Admin\Views
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
		/* translators: %s expands to <code>&lt;head&gt;</code> */
		printf( __( 'Add Open Graph meta data to your site\'s %s section, Facebook and other social networks use this data when your pages are shared.', 'wordpress-seo' ), '<code>&lt;head&gt;</code>' );
		?>
	</p>

<?php
if ( 'posts' == get_option( 'show_on_front' ) ) {
	echo '<h2>' . esc_html__( 'Frontpage settings', 'wordpress-seo' ) . '</h2>';
	echo '<p>' . esc_html__( 'These are the title, description and image used in the Open Graph meta tags on the front page of your site.', 'wordpress-seo' ) . '</p>';

	$yform->media_input( 'og_frontpage_image', __( 'Image URL', 'wordpress-seo' ) );
	$yform->textinput( 'og_frontpage_title', __( 'Title', 'wordpress-seo' ) );
	$yform->textinput( 'og_frontpage_desc', __( 'Description', 'wordpress-seo' ) );

	// Offer copying of meta description.
	$meta_options = get_option( 'wpseo_titles' );
	echo '<input type="hidden" id="meta_description" value="', esc_attr( $meta_options['metadesc-home-wpseo'] ), '" />';
	echo '<p class="label desc" style="border:0;"><a href="javascript:;" onclick="wpseoCopyHomeMeta();" class="button">', esc_html__( 'Copy home meta description', 'wordpress-seo' ), '</a></p>';

} ?>

	<h2><?php esc_html_e( 'Default settings', 'wordpress-seo' ); ?></h2>
<?php $yform->media_input( 'og_default_image', __( 'Image URL', 'wordpress-seo' ) ); ?>
	<p class="desc label">
		<?php esc_html_e( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ); ?>
	</p>

<?php

$social_facebook = new Yoast_Social_Facebook();
$social_facebook->show_form();

do_action( 'wpseo_admin_opengraph_section' );
