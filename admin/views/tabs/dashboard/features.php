<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 */

/**
 * @var Yoast_Form $yform
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
		/* translators: %1$s expands to Yoast SEO */
		esc_html__( '%1$s comes with a lot of features. You can enable / disable some of them below. Clicking the question mark gives more information about the feature.', 'wordpress-seo' ),
		'Yoast SEO'
	);

	foreach ( $feature_toggles as $feature ) {
		$help_text = esc_html( $feature->label );
		if ( ! empty( $feature->extra ) ) {
			$help_text .= ' ' . $feature->extra;
		}
		if ( ! empty( $feature->read_more_label ) ) {
			$help_text .= ' ';
			$help_text .= sprintf(
				'<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>',
				esc_url( WPSEO_Shortlinker::get( $feature->read_more_url ) ),
				esc_html( $feature->read_more_label )
			);
		}

		$feature_help = new WPSEO_Admin_Help_Panel(
			$feature->setting,
			/* translators: %s expands to a feature's name */
			sprintf( esc_html__( 'Help on: %s', 'wordpress-seo' ), esc_html( $feature->name ) ),
			$help_text
		);

		$yform->toggle_switch(
			$feature->setting,
			array(
				'on'  => __( 'On', 'wordpress-seo' ),
				'off' => __( 'Off', 'wordpress-seo' ),
			),
			'<strong>' . $feature->name . '</strong>',
			$feature_help->get_button_html() . $feature_help->get_panel_html()
		);
	}
	?>
</div>
<?php
// Required to prevent our settings framework from saving the default because the field isn't explicitly set when saving the Dashboard page.
$yform->hidden( 'show_onboarding_notice', 'wpseo_show_onboarding_notice' );
