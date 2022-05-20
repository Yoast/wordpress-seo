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

$feature_toggles = Yoast_Feature_Toggles::instance()->get_all();

?>
<h2><?php esc_html_e( 'Features', 'wordpress-seo' ); ?></h2>
<div class="yoast-measure">
	<?php
	echo sprintf(
		/* translators: %s expands to Yoast SEO */
		esc_html__( 'This tab allows you to selectively disable %s features for all sites in the network. By default all features are enabled, which allows site admins to choose for themselves if they want to toggle a feature on or off for their site. When you disable a feature here, site admins will not be able to use that feature at all.', 'wordpress-seo' ),
		'Yoast SEO'
	);

	$help_text  = esc_html__( 'This removes the Post Comment Feed link.', 'wordpress-seo' );
	$help_text .= ' ';
	$help_text .= sprintf(
		'<a href="#" target="_blank" rel="noopener noreferrer">%1$s</a>',
		esc_html__( 'Find out how removing feeds can improve performance.', 'wordpress-seo' )
	);

	$feature_help = new WPSEO_Admin_Help_Panel(
		'remove_feed_post_comments',
		/* translators: %s expands to a feature's name */
		esc_html__( 'Help on: Post comment feeds', 'wordpress-seo' ),
		$help_text
	);

	$yform->toggle_switch(
		WPSEO_Option::ALLOW_KEY_PREFIX .  'remove_feed_post_comments',
		[
			'on'  => __( 'Allow Control', 'wordpress-seo' ),
			'off' => __( 'Disable', 'wordpress-seo' ),
		],
		__( 'Post comment feeds', 'wordpress-seo' ),
		$feature_help->get_button_html() . $feature_help->get_panel_html()
	);
	?>
</div>
<?php
/*
 * Required to prevent our settings framework from saving the default because the field
 * isn't explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
