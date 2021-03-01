<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

echo '<h2>' . \esc_html__( 'Facebook settings', 'wordpress-seo' ) . '</h2>';

$yform->light_switch( 'opengraph', \__( 'Add Open Graph meta data', 'wordpress-seo' ) );

?>
	<p>
		<?php
			\esc_html_e( 'Enable this feature if you want Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.', 'wordpress-seo' );
		?>
	</p>
<?php
	$frontpage_settings_message = sprintf(
	/* translators: 1: link open tag; 2: link close tag., 3: the translated label of the link */
	\esc_html__( 'The frontpage settings have been moved to the %1$sSearch Appearance section%2$s.', 'wordpress-seo' ),
	'<a href="' . \esc_url( \admin_url( 'admin.php?page=wpseo_titles#top#post-types' ) ) . '">',
	'</a>',
	);

	$frontpage_settings_alert = new Alert_Presenter( $frontpage_settings_message, 'info' );

	echo '<div class="yoast-measure">' . $frontpage_settings_alert->present() . '</div>';
?>
<div id="wpseo-opengraph-settings" style="display: none;">
<?php

echo '<h2>' . \esc_html__( 'Default settings', 'wordpress-seo' ) . '</h2>';

$yform->hidden( 'og_default_image', 'og_default_image' );
$yform->hidden( 'og_default_image_id', 'og_default_image_id' );

?>
	<p>
		<?php \esc_html_e( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ); ?>
	</p>
	<div id="yoast-og-default-image-select"></div>
</div>
<?php

\do_action( 'wpseo_admin_opengraph_section' );
