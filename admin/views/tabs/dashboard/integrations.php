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

$integration_toggles = Yoast_Integration_Toggles::instance()->get_all();

?>
	<h2><?php esc_html_e( 'Integrations', 'wordpress-seo' ); ?></h2>
	<div class="yoast-measure">
		<?php

		$integrations_moved_message = sprintf(
			/* translators: 1: link open tag; 2: link close tag. */
			esc_html__( 'Looking for your integrations settings? We\'ve moved them to a %1$sseparate Integrations page%2$s.', 'wordpress-seo' ),
			'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_integrations' ) ) . '">',
			'</a>'
		);

		$frontpage_settings_alert = new Alert_Presenter( $integrations_moved_message, 'info' );

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
		echo $frontpage_settings_alert->present();

		$yform->hidden( 'semrush_integration_active', 'semrush_integration_active' );
		$yform->hidden( 'ryte_indexability', 'ryte_indexability' );
		$yform->hidden( 'zapier_integration_active', 'zapier_integration_active' );
		$yform->hidden( 'algolia_integration_active', 'algolia_integration_active' );
		$yform->hidden( 'wincher_integration_active', 'wincher_integration_active' );
		$yform->hidden( 'wordproof_integration_active', 'wordproof_integration_active' );
		?>
	</div>
<?php
/*
 * Required to prevent our settings framework from saving the default because the field isn't
 * explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
