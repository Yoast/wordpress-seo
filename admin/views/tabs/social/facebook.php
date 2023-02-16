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
	$frontpage_settings_message = sprintf(
		/* translators: 1: link open tag; 2: link close tag. */
		esc_html__( 'The social homepage settings have been moved to the %1$s‘Search appearance’ settings under the ‘General’ tab%2$s.', 'wordpress-seo' ),
		'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_page_settings#/homepage' ) ) . '">',
		'</a>'
	);

	$frontpage_settings_alert = new Alert_Presenter( $frontpage_settings_message, 'info' );

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
	echo '<div class="yoast-measure">' . $frontpage_settings_alert->present() . '</div>';

	$yform->hidden( 'og_frontpage_title', 'og_frontpage_title' );
	$yform->hidden( 'og_frontpage_desc', 'og_frontpage_desc' );
	$yform->hidden( 'og_frontpage_image', 'og_frontpage_image' );
	$yform->hidden( 'og_frontpage_image_id', 'og_frontpage_image_id' );

	echo '<h3>' . esc_html__( 'Default image', 'wordpress-seo' ) . '</h3>';

	$yform->hidden( 'og_default_image', 'og_default_image' );
	$yform->hidden( 'og_default_image_id', 'og_default_image_id' );
	?>
	<p>
		<?php esc_html_e( 'This image is used if the post/page being shared does not contain any images.', 'wordpress-seo' ); ?>
	</p>
	<div id="yoast-og-default-image-select" class="yoast-measure"></div>
</div>
<?php

/**
 * WARNING: This hook is intended for internal use only.
 * Don't use it in your code as it will be removed shortly.
 */
do_action( 'wpseo_admin_opengraph_section_internal' );

/**
 * Admin OpenGraph section hook.
 *
 * @deprecated 19.10 No replacement available.
 */
do_action_deprecated(
	'wpseo_admin_opengraph_section',
	[],
	'19.10',
	'',
	'This action is going away with no replacement. If you want to add settings that interact with Yoast SEO, please create your own settings page.'
);
