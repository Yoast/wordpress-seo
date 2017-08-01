<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$feature_toggles = array(
	(object) array(
		'name'    => __( 'Readability analysis', 'wordpress-seo' ),
		'setting' => 'content_analysis_active',
		'label'   => __( 'Removes the readability tab from the metabox and disables all readability-related suggestions.', 'wordpress-seo' ),
	),
	(object) array(
		'name'    => __( 'Keyword analysis', 'wordpress-seo' ),
		'setting' => 'keyword_analysis_active',
		'label'   => __( 'Removes the keyword tab from the metabox and disables all keyword-related suggestions.', 'wordpress-seo' ),
	),
	(object) array(
		'name'    => __( 'Advanced settings pages', 'wordpress-seo' ),
		'setting' => 'enable_setting_pages',
		'label'   => __( 'The advanced settings include site-wide settings for your titles and meta descriptions, social metadata, sitemaps and much more.', 'wordpress-seo' ),
	),
	(object) array(
		'name'    => 'Ryte',
		'setting' => 'onpage_indexability',
		/* translators: %1$s expands to Ryte. */
		'label'   => sprintf( __( 'The %1$s integration checks daily if your site is still indexable by search engines and notifies you when this is not the case.', 'wordpress-seo' ), 'Ryte' ),
	),
	(object) array(
		'name'    => __( 'Admin bar menu', 'wordpress-seo' ),
		'setting' => 'enable_admin_bar_menu',
		/* translators: %1$s expands to Yoast SEO*/
		'label'   => sprintf( __( 'The %1$s admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.', 'wordpress-seo' ), 'Yoast SEO' ),
	),
	(object) array(
		'name'    => __( 'Cornerstone content', 'wordpress-seo' ),
		'setting' => 'enable_cornerstone_content',
		/* translators: 1: open link tag 2: close link tag */
		'label'   => sprintf(
			__( 'The Cornerstone content functionality enables you to mark and filter cornerstone content on your website. %1$sRead more about how cornerstone content can help you improve your site structure.%2$s', 'wordpress-seo' ),
			'<a href="' .  WPSEO_Shortlinker::get( 'https://yoa.st/dashboard-help-cornerstone' ) . '" target="_blank">',
			'</a>'
		),
	),
	(object) array(
		'name'    => __( 'Text link counter', 'wordpress-seo' ),
		'setting' => 'enable_text_link_counter',
		'label'   => sprintf(
			__( 'This feature helps you improve the internal link structure of your site. If you want to know more about the why and how of internal linking, check out the %1$sarticle about internal linking on Yoast.com%2$s.', 'wordpress-seo' ),
			'<a href="' .  WPSEO_Shortlinker::get( 'https://yoa.st/17g' ) . '" target="_blank">',
			'</a>'
		),
	),
);

/**
 * Filter to add feature toggles from add-ons.
 *
 * @param array $feature_toggles Array with feature toggle objects where each object should have a `name`, `setting` and `label` property.
 */
$feature_toggles = apply_filters( 'wpseo_feature_toggles', $feature_toggles );

?>
<h2><?php esc_html_e( 'Features', 'wordpress-seo' ); ?></h2>

<?php echo esc_html( sprintf(
	__( '%1$s comes with a lot of features. You can enable / disable some of them below.', 'wordpress-seo' ),
	'Yoast SEO'
) ) ?>
<?php foreach ( $feature_toggles as $feature ) : ?>
<h3><?php echo esc_html( $feature->name ); ?></h3>
<p>
	<?php
		$yform->toggle_switch(
			$feature->setting,
			array(
				'on'  => __( 'Enabled', 'wordpress-seo' ),
				'off' => __( 'Disabled', 'wordpress-seo' ),
			),
			$feature->label
		);
	?>
</p>
<br />

<?php endforeach; ?>

<?php
	// Required to prevent our settings framework from saving the default because the field isn't explicitly set when saving the Dashboard page.
	$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
?>
