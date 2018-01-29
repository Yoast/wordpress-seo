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
		'name'            => __( 'SEO analysis', 'wordpress-seo' ),
		'setting'         => 'keyword_analysis_active',
		'label'           => __( 'The SEO analysis offers suggestions to improve the SEO of your text.', 'wordpress-seo' ),
		'read_more_label' => __( 'Learn how the SEO analysis can help you rank.', 'wordpress-seo' ),
		'read_more_url'   => 'https://yoa.st/2ak',
		'order'           => 10,
	),
	(object) array(
		'name'            => __( 'Readability analysis', 'wordpress-seo' ),
		'setting'         => 'content_analysis_active',
		'label'           => __( 'The readability analysis offers suggestions to improve the structure and style of your text.', 'wordpress-seo' ),
		'read_more_label' => __( 'Discover why readability is important for SEO.', 'wordpress-seo' ),
		'read_more_url'   => 'https://yoa.st/2ao',
		'order'           => 20,
	),
	(object) array(
		'name'            => __( 'Cornerstone content', 'wordpress-seo' ),
		'setting'         => 'enable_cornerstone_content',
		'label'           => __( 'The cornerstone content feature lets you to mark and filter cornerstone content on your website.', 'wordpress-seo' ),
		'read_more_label' => __( 'Find out how cornerstone content can help you improve your site structure.', 'wordpress-seo' ),
		'read_more_url'   => 'https://yoa.st/dashboard-help-cornerstone',
		'order'           => 30,
	),
	(object) array(
		'name'            => __( 'Text link counter', 'wordpress-seo' ),
		'setting'         => 'enable_text_link_counter',
		'label'           => __( 'The text link counter helps you improve your site structure.', 'wordpress-seo' ),
		'read_more_label' => __( 'Find out how the text link counter can enhance your SEO.', 'wordpress-seo' ),
		'read_more_url'   => 'https://yoa.st/2aj',
		'order'           => 40,
	),
	(object) array(
		'name'            => __( 'Advanced settings pages', 'wordpress-seo' ),
		'setting'         => 'enable_setting_pages',
		'label'           => __( 'The advanced settings include site-wide settings for your titles and meta descriptions, social metadata, sitemaps and much more.', 'wordpress-seo' ),
		'read_more_label' => __( 'Discover all the features that Yoast SEO offers.', 'wordpress-seo' ),
		'read_more_url'   => 'https://yoa.st/2am',
		'order'           => 50,
	),
	(object) array(
		/* translators: %s expands to Ryte. */
		'name'            => sprintf( __( '%s integration', 'wordpress-seo' ), 'Ryte' ),
		'setting'         => 'onpage_indexability',
		/* translators: %1$s expands to Ryte. */
		'label'           => sprintf( __( '%1$s can check daily if your site is still indexable by search engines and will notify you when this is not the case.', 'wordpress-seo' ), 'Ryte' ),
		/* translators: %s expands to Ryte. */
		'read_more_label' => sprintf( __( 'Read more about how %s works.', 'wordpress-seo' ), 'Ryte ' ),
		'read_more_url'   => 'https://yoa.st/2an',
		'order'           => 60,
	),
	(object) array(
		'name'    => __( 'Admin bar menu', 'wordpress-seo' ),
		'setting' => 'enable_admin_bar_menu',
		/* translators: %1$s expands to Yoast SEO*/
		'label'   => sprintf( __( 'The %1$s admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.', 'wordpress-seo' ), 'Yoast SEO' ),
		'order'   => 70,
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
<div style="max-width:600px">
<?php echo esc_html( sprintf(
/* translators: %1$s expands to Yoast SEO */
	__( '%1$s comes with a lot of features. You can enable / disable some of them below.', 'wordpress-seo' ),
	'Yoast SEO'
) ) ?>
<?php

/**
 * Simple sorting function used for usort straight below.
 *
 * @param object $feature_a Feature A.
 * @param object $feature_b Feature B.
 *
 * @return bool Whether order for feature A is bigger than for feature B.
 */
function wpseo_cmp_order( $feature_a, $feature_b ) {
	return ( $feature_a->order > $feature_b->order );
}
usort( $feature_toggles, 'wpseo_cmp_order' );

foreach ( $feature_toggles as $feature ) : ?>
	<h3><?php echo esc_html( $feature->name ); ?></h3>
	<p>
		<?php
		$label = esc_html( $feature->label );
		if ( ! empty( $feature->read_more_label ) ) {
			$label .= ' ' . sprintf( '<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>', WPSEO_Shortlinker::get( $feature->read_more_url ), esc_html( $feature->read_more_label ) );
		}
		$yform->toggle_switch(
			$feature->setting,
			array(
				'on'  => __( 'Enabled', 'wordpress-seo' ),
				'off' => __( 'Disabled', 'wordpress-seo' ),
			),
			$label
		);
		?>
	</p>
	<br/>

<?php endforeach; ?>
</div>
<?php
// Required to prevent our settings framework from saving the default because the field isn't explicitly set when saving the Dashboard page.
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
?>
