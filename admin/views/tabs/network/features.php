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
$yoast_features = new WPSEO_Features();

?>

<h2><?php esc_html_e( 'Features', 'wordpress-seo' ); ?></h2>
<div class="yoast-feature">
	<p>
		<?php
		printf(
			/* translators: %s expands to Yoast SEO */
			esc_html__( 'This tab allows you to selectively disable %s features for all sites in the network. By default all features are enabled, which allows site admins to choose for themselves if they want to toggle a feature on or off for their site. When you disable a feature here, site admins will not be able to use that feature at all.', 'wordpress-seo' ),
			'Yoast SEO'
		);
		?>
	</p>

	<?php
	foreach ( $feature_toggles as $feature ) {
		if ( $feature->premium && ! $yoast_features->is_premium() ) {
			$yform->light_switch_disabled(
				$feature->setting,
				$feature->name,
				[
					__( 'Off', 'wordpress-seo' ),
					__( 'On', 'wordpress-seo' ),
				],
				new WPSEO_Admin_Help_Button( $feature->read_more_url, $feature->read_more_label ),
				false,
				esc_url( WPSEO_Shortlinker::get( $feature->upsell_url ) )
			);
		}
		else {

			$yform->light_switch(
				$feature->setting,
				$feature->name,
				[
					__( 'Off', 'wordpress-seo' ),
					__( 'On', 'wordpress-seo' ),
				],
				new WPSEO_Admin_Help_Button( $feature->read_more_url, $feature->read_more_label )
			);
		}
	}
	?>

</div>
<?php

/*
 * Required to prevent our settings framework from saving the default because the field
 * isn't explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
