<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

use Yoast\WP\SEO\Presenters\Admin\Badge_Presenter;

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
		echo sprintf(
		/* translators: %1$s expands to Yoast SEO */
			esc_html__( 'This tab allows you to selectively disable %1$s integrations with third-party products for all sites in the network. By default all integrations are enabled, which allows site admins to choose for themselves if they want to toggle an integration on or off for their site. When you disable an integration here, site admins will not be able to use that integration at all.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		foreach ( $integration_toggles as $integration ) {
			$help_text = esc_html( $integration->label );

			if ( ! empty( $integration->extra ) ) {
				$help_text .= ' ' . $integration->extra;
			}

			if ( ! empty( $integration->read_more_label ) ) {
				$help_text .= ' ';
				$help_text .= sprintf(
					'<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>',
					esc_url( WPSEO_Shortlinker::get( $integration->read_more_url ) ),
					esc_html( $integration->read_more_label )
				);
			}

			$feature_help = new WPSEO_Admin_Help_Panel(
				WPSEO_Option::ALLOW_KEY_PREFIX . $integration->setting,
				/* translators: %s expands to an integration's name */
				sprintf( esc_html__( 'Help on: %s', 'wordpress-seo' ), esc_html( $integration->name ) ),
				$help_text
			);

			$name = $integration->name;
			if ( ! empty( $integration->new ) && $integration->new === true ) {
				$name .= ' ' . new Badge_Presenter( $integration->name );
			}

			$yform->toggle_switch(
				WPSEO_Option::ALLOW_KEY_PREFIX . $integration->setting,
				[
					'on'  => __( 'Allow Control', 'wordpress-seo' ),
					'off' => __( 'Disable', 'wordpress-seo' ),
				],
				$name,
				$feature_help->get_button_html() . $feature_help->get_panel_html(),
				[ 'disabled' => $integration->disabled ]
			);

			do_action( 'Yoast\WP\SEO\admin_network_integration_after', $integration );
		}
		?>
	</div>
<?php
/*
 * Required to prevent our settings framework from saving the default because the field isn't
 * explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
