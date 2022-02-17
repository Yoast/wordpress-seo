<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Print_QR_Code_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class that embeds a hidden QR code image that's shown when a page is printed.
 */
class Print_QRCode_Embed implements Integration_Interface {

	/**
	 * Register the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_footer', [ $this, 'generate_qr_code' ] );
		\add_action( 'wp_head', [ $this, 'enqueue_css' ] );
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
	 * Make sure we print the CSS nicely.
	 *
	 * @return void
	 */
	public function enqueue_css() {
		$css = '.yoast_seo_print_only{display:none;}@media print{.yoast_seo_print_only{display:block;text-align:center;}}}';
		// phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- Inline style so this isn't needed.
		\wp_register_style( 'yoast_print_qr', false );
		\wp_enqueue_style( 'yoast_print_qr' );
		\wp_add_inline_style( 'yoast_print_qr', $css );
	}

	/**
	 * Adds an `img` tag to the current page for a QR code. Due to the CSS above this is only loaded when the page is printed.
	 *
	 * @return void
	 */
	public function generate_qr_code() {
		$nonce     = \wp_create_nonce( 'yoast_seo_qr_code' );
		$url       = \YoastSEO()->meta->for_current_page()->canonical;
		$alt_text  = __( 'QR Code for current page\'s URL.', 'wordpress-seo' );
		$text      = __( 'Scan the QR code or go to the URL below to read this article online.', 'wordpress-seo' );
		$image_url = trailingslashit( get_site_url() ) . '?nonce=' . $nonce . '&yoast_qr_code=' . rawurlencode( $url );
		printf(
			'<div class="yoast_seo_print_only"><img src="%4$s" width="150" height="150" alt="%1$s" /><p>%2$s<br/>%3$s</p></div>' . PHP_EOL,
			esc_attr( $alt_text ),
			esc_html( $text ),
			esc_html( $url ),
			esc_url( $image_url )
		);
	}
}
