<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Views\Integrations
 *
 * @uses Yoast_Form $yform Form object.
 */


use Yoast\WP\SEO\Config\Wincher_Client;

$asset_manager = new WPSEO_Admin_Asset_Manager();
$asset_manager->enqueue_style( 'monorepo' );

$wincher_client = YoastSEO()->classes->get( Wincher_Client::class );
?>

<div id="wincher-connection">
	<div class="yoast">
	<?php

	$yform = Yoast_Form::get_instance();

	if ( $wincher_client->has_valid_tokens() ) {
		$yform->checkbox(
			'wincher_automatically_add_keyphrases',
			sprintf(
			/* translators: %s expands to Wincher */
				esc_html__( 'Automatically add new keyphrases to %s', 'wordpress-seo' ),
				'Wincher'
			)
		);
	}

	$button_text = sprintf(
		/* translators: %s expands to Wincher */
		esc_html__( 'Add existing keyphrases to %s', 'wordpress-seo' ),
		'Wincher'
	);
	echo sprintf(
		'<button class="yoast-button yoast-button--secondary">%s</button>',
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- The text is already escaped.
		$button_text
	);
	?>
		<br />
</div>


</div>
