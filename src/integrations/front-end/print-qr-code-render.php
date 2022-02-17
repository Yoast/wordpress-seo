<?php

namespace Yoast\WP\SEO\Integrations;

use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Print_QR_Code_Enabled_Conditional;

/**
 * Class that renders a QR code for URLs.
 */
class Print_QR_Code_Render implements Integration_Interface {

	/**
	 * Register the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'send_headers', [ $this, 'generate_qr_code' ], 0 );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, Print_QR_Code_Enabled_Conditional::class ];
	}

	/**
	 * Generates a QR code and outputs it as SVG.
	 *
	 * @return void
	 */
	public function generate_qr_code() {
		$url = \filter_input( INPUT_GET, 'yoast_qr_code', FILTER_SANITIZE_URL );
		if ( ! isset( $url ) ) {
			return;
		}

		$nonce = \filter_input( INPUT_GET, 'nonce', FILTER_SANITIZE_STRING );
		if ( ! \wp_verify_nonce( $nonce, 'yoast_seo_qr_code' ) ) {
			\wp_die( 'This is not a QR code endpoint for public consumption.' );
		}

		$options = new QROptions( [
			'outputType' => QRCode::OUTPUT_MARKUP_SVG,
		] );
		$qr_code = new QRCode( $options );

		\header( 'Content-type: image/svg+xml', true );
		echo $qr_code->render( $url );
		exit( 200 );
	}
}
