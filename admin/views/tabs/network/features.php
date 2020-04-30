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
<div class="tab-block">
	<h2><?php esc_html_e( 'Features', 'wordpress-seo' ); ?></h2>
	<div class="yoast-measure">
		<?php
		echo sprintf(
			/* translators: %s Expands to Yoast SEO. */
			esc_html__( 'This tab allows you to selectively disable %s features for all sites in the network. By default all features are enabled, which allows site admins to choose for themselves if they want to toggle a feature on or off for their site. When you disable a feature here, site admins will not be able to use that feature at all.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		foreach ( $feature_toggles as $feature ) {
			$feature_help = new WPSEO_Admin_Help_Button(
				$feature->read_more_url,
				/* translators: %s Expands to a feature's name. */
				sprintf( esc_html__( 'Help on: %s', 'wordpress-seo' ), esc_html( $feature->name ) )
			);

			$yform->toggle_switch(
				WPSEO_Option::ALLOW_KEY_PREFIX . $feature->setting,
				[
					'on'  => esc_html__( 'Allow Control', 'wordpress-seo' ),
					'off' => esc_html__( 'Disable', 'wordpress-seo' ),
				],
				'<strong>' . esc_html( $feature->name ) . '</strong>',
				$feature_help
			);
		}
		?>
	</div>
</div>
<?php

/*
 * Required to prevent our settings framework from saving the default because the field
 * isn't explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
