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

$integration_toggles = Yoast_Integration_Toggles::instance()->get_all();

?>
	<h2><?php esc_html_e( 'Integrations', 'wordpress-seo' ); ?></h2>
	<div class="yoast-measure">
		<?php
		echo sprintf(
		/* translators: %1$s expands to Yoast SEO */
			esc_html__( '%1$s can integrate with third parties products. You can enable or disable these integrations below.', 'wordpress-seo' ),
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
				$integration->setting,
				/* translators: %s expands to an integration's name */
				sprintf( esc_html__( 'Help on: %s', 'wordpress-seo' ), esc_html( $integration->name ) ),
				$help_text
			);

			$yform->toggle_switch(
				$integration->setting,
				[
					'on'  => __( 'On', 'wordpress-seo' ),
					'off' => __( 'Off', 'wordpress-seo' ),
				],
				'<strong>' . $integration->name . '</strong>',
				$feature_help->get_button_html() . $feature_help->get_panel_html()
			);

			if ( ! empty( $integration->after ) ) {
				// phpcs:ignore WordPress.Security.EscapeOutput -- after contains HTMl and we assume it's properly escape on object creation.
				echo $integration->after;
			}
		}
		?>
	</div>
<?php
/*
 * Required to prevent our settings framework from saving the default because the field isn't
 * explicitly set when saving the Dashboard page.
 */
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
