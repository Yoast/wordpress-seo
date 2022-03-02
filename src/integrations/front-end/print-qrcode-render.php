<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Exception;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Print_QRCode_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use YoastSEO_Vendor\chillerlan\QRCode\QRCode;
use YoastSEO_Vendor\chillerlan\QRCode\QROptions;

/**
 * Class that renders a QR code for URLs.
 */
class Print_QRCode_Render implements Integration_Interface {

	/**
	 * The Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Print_QRCode_Embed constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		Options_Helper $options_helper
	) {
		$this->options_helper = $options_helper;
	}

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

		$code = \filter_input( INPUT_GET, 'code', FILTER_SANITIZE_STRING );
		$salt = $this->options_helper->get( 'print_qr_code_salt' );
		if ( \md5( $salt . $url ) !== $code ) {
			\header( 'Content-Type: text/plain', true, 400 );
			echo \esc_html( __( 'This is not a QR code endpoint for public consumption.', 'wordpress-seo' ) );
			exit();
		}

		try {
			$options = new QROptions( [ 'outputType' => QRCode::OUTPUT_MARKUP_SVG ] );
			$qr_code = new QRCode( $options );

			\header( 'Content-type: image/svg+xml', true );
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- We trust the QR class to output safe content.
			echo $qr_code->render( $url );
			exit( 200 );
		}
		catch ( Exception $e ) {
			\header( 'Content-Type: text/plain', true, 400 );
			/* translators: %1$s expands to the error message */
			echo \esc_html( \sprintf( __( 'Failed to generate QR Code: %s', 'wordpress-seo' ), $e->getMessage() ) );
			exit();
		}
	}
}
