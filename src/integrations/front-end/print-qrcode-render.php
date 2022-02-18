<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use YoastSEO_Vendor\chillerlan\QRCode\QRCode;
use YoastSEO_Vendor\chillerlan\QRCode\QROptions;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Print_QRCode_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class that renders a QR code for URLs.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 4 words is fine.
 */
class Print_QRCode_Render implements Integration_Interface {

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
		return [ Front_End_Conditional::class, Print_QRCode_Enabled_Conditional::class ];
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

		$options = new QROptions( [ 'outputType' => QRCode::OUTPUT_MARKUP_SVG ] );
		$qr_code = new QRCode( $options );

		\header( 'Content-type: image/svg+xml', true );
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- We trust the QR class to output safe content.
		echo $qr_code->render( $url );
		exit( 200 );
	}
}
