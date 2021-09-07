<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Integrations
 *
 * @uses Yoast_Form $yform Form object.
 */

use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;

$asset_manager = new WPSEO_Admin_Asset_Manager();
$asset_manager->enqueue_style( 'monorepo' );

$wincher_is_logged_in = YoastSEO()->helpers->wincher->login_status();

?>

<div id="wincher-connection">
	<div class="yoast">
	<?php

	$yform = Yoast_Form::get_instance();

	if ( $wincher_is_logged_in ) {

		echo '<div id="wincher-automatic-tracking-upsell">';

		$upsell_message = sprintf(
			/* translators: 1: Link start tag to the Wincher pricing page, 2: expands to Wincher, 3: Link closing tag. */
			esc_html__( 'Enabling automatic tracking of your keyphrases by %2$s can quickly exceed account limits. If you want to ensure all your keyphrases can be tracked, please %1$supgrade your plan%3$s.', 'wordpress-seo' ),
			'<a href="https://www.wincher.com/pricing" target="_blank" rel="noopener noreferrer">',
			'Wincher',
			'</a>'
		);

		$upsell_alert = new Alert_Presenter( $upsell_message, 'info' );

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
		echo '<div class="yoast-measure">' . $upsell_alert->present() . '</div>';
		echo '</div>';

		$yform->checkbox(
			'wincher_automatically_add_keyphrases',
			sprintf(
			/* translators: %s expands to Wincher */
				esc_html__( 'Automatically add new keyphrases to %s', 'wordpress-seo' ),
				'Wincher'
			)
		);
	}

	echo '<br />';

	echo '<div id="wincher-track-all-keyphrases-success" style="display: none;">';
	$successfully_added_message = sprintf(
		/* translators: %s: Expands to "Wincher". */
		__( 'Your existing keyphrases have been successfully added to %s.', 'wordpress-seo' ),
		'Wincher'
	);

	$successfully_added_alert = new Alert_Presenter( $successfully_added_message, 'success' );

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
	echo '<div class="yoast-measure">' . $successfully_added_alert->present() . '</div>';
	echo '</div>';

	echo '<div id="wincher-track-all-keyphrases-error" style="display: none;">';

	$limit_reached_message = sprintf(
		/* translators: 1: A span element associated with the account limit, 2: The span closing tag, 3: Link start tag to the Wincher website, 4: expands to Wincher, 5: Link closing tag. */
		esc_html__( 'You\'ve reached the maximum amount of %1$s%2$s keyphrases you can add to your %4$s account. If you wish to add more keyphrases, please %3$supgrade your %4$s plan.%5$s.', 'wordpress-seo' ),
		'<span id="wincher-track-all-limit">',
		'</span>',
		'<a href="https://www.wincher.com/pricing">',
		'Wincher',
		'</a>'
	);

	$limit_reached_alert = new Alert_Presenter( $limit_reached_message, 'error' );

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
	echo '<div class="yoast-measure">' . $limit_reached_alert->present() . '</div>';
	echo '</div>';

	echo '<div id="wincher-website-error" style="display: none;">';

	$website_error_message = sprintf(
		/* translators: %1$s expands to the opening tag for a link to open the Wincher login popup, %2$s expands to Wincher, %3$s expands to the closing tag for the link. */
		esc_html__( 'It seems like something went wrong when retrieving your website\'s data. Please %1$s reconnect to %2$s and try again%3$s.', 'wordpress-seo' ),
		'<a href="#" id="wincher-track-all-website-error-link">',
		'Wincher',
		'</a>'
	);

	$website_error_alert = new Alert_Presenter( $website_error_message, 'error' );

	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output from present() is considered safe.
	echo '<div class="yoast-measure">' . $website_error_alert->present() . '</div>';
	echo '</div>';

	$button_text = sprintf(
		/* translators: %s expands to Wincher */
		esc_html__( 'Add existing keyphrases to %s', 'wordpress-seo' ),
		'Wincher'
	);
	echo sprintf(
		'<button class="yoast-button yoast-button--secondary" id="wincher-track-all-keyphrases">%s</button>',
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The text is already escaped.
		$button_text
	);

	// Ensure we don't accidentally reset the website ID.
	$yform->hidden( 'wincher_website_id' );
	?>
		<br />
</div>


</div>
