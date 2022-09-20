<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views
 *
 * @uses Yoast_Form $yform Form object.
 */

use Yoast\WP\SEO\Presenters\Admin\Beta_Badge_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Premium_Badge_Presenter;

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
		$is_premium      = YoastSEO()->helpers->product->is_premium();
		$premium_version = YoastSEO()->helpers->product->get_premium_version();

		$help_text = esc_html( $feature->label );
		if ( ! empty( $feature->extra ) ) {
			$help_text .= ' ' . $feature->extra;
		}
		if ( ! empty( $feature->read_more_label ) ) {
			$url = $feature->read_more_url;
			if ( ! empty( $feature->premium ) && $feature->premium === true ) {
				$url = $feature->premium_url;
			}
			$help_text .= ' ';
			$help_text .= sprintf(
				'<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>',
				esc_url( WPSEO_Shortlinker::get( $url ) ),
				esc_html( $feature->read_more_label )
			);
		}

		$feature_help = new WPSEO_Admin_Help_Panel(
			$feature->setting,
			/* translators: %s expands to a feature's name */
			sprintf( esc_html__( 'Help on: %s', 'wordpress-seo' ), esc_html( $feature->name ) ),
			$help_text
		);

		$name = $feature->name;
		if ( ! empty( $feature->premium ) && $feature->premium === true ) {
			$name .= ' ' . new Premium_Badge_Presenter( $feature->name );
		}

		if ( ! empty( $feature->in_beta ) && $feature->in_beta === true ) {
			$name .= ' ' . new Beta_Badge_Presenter( $feature->name );
		}

		$disabled            = false;
		$show_premium_upsell = false;
		$premium_upsell_url  = '';
		$note_when_disabled  = '';
		if ( $feature->premium === true && YoastSEO()->helpers->product->is_premium() === false ) {
			$disabled            = true;
			$show_premium_upsell = true;
			$premium_upsell_url  = WPSEO_Shortlinker::get( $feature->premium_upsell_url );
		}

		$current_language                             = WPSEO_Language_Utils::get_language( \get_locale() );
		$feature_is_not_supported_in_current_language = $feature->supported_languages && ! \in_array( $current_language, $feature->supported_languages, true );

		if ( $feature_is_not_supported_in_current_language ) {
			$disabled            = true;
			$show_premium_upsell = false;
			$note_when_disabled  = __( 'This feature has been disabled, since it is not supported for your language yet.', 'wordpress-seo' );
			// Do not show Premium or Beta badge.
			$name = $feature->name;
		}

		if ( $feature->premium && $feature->premium_version ) {
			$not_supported_in_current_premium_version = $is_premium && \version_compare( $premium_version, $feature->premium_version, '<' );

			if ( $not_supported_in_current_premium_version ) {
				$disabled           = true;
				$note_when_disabled = __( 'Please update your Yoast SEO Premium plugin to the latest version to be able to use this feature.', 'wordpress-seo' );
			}
		}

		$preserve_disabled_value = false;
		if ( $disabled ) {
			$preserve_disabled_value = true;
		}

		$yform->toggle_switch(
			$feature->setting,
			[
				'on'  => __( 'On', 'wordpress-seo' ),
				'off' => __( 'Off', 'wordpress-seo' ),
			],
			$name,
			$feature_help->get_button_html() . $feature_help->get_panel_html(),
			[
				'disabled'                => $disabled,
				'preserve_disabled_value' => $preserve_disabled_value,
				'show_premium_upsell'     => $show_premium_upsell,
				'premium_upsell_url'      => $premium_upsell_url,
				'note_when_disabled'      => $note_when_disabled,
			]
		);

		if ( ! empty( $feature->after ) ) {
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Escaping handled in integrations.
			echo $feature->after;
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
