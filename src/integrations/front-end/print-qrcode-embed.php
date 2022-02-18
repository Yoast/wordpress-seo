<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\Print_QRCode_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * Class that embeds a hidden QR code image that's shown when a page is printed.
 */
class Print_QRCode_Embed implements Integration_Interface {

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Print_QRCode_Embed constructor.
	 *
	 * @param Meta_Surface $meta_surface The meta surface.
	 */
	public function __construct( Meta_Surface $meta_surface ) {
		$this->meta_surface = $meta_surface;
	}

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
		return [ Front_End_Conditional::class, Print_QRCode_Enabled_Conditional::class ];
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
		$url       = $this->meta_surface->for_current_page()->canonical;
		$alt_text  = __( 'QR Code for current page\'s URL.', 'wordpress-seo' );
		$text      = __( 'Scan the QR code or go to the URL below to read this article online.', 'wordpress-seo' );
		$image_url = \trailingslashit( \get_site_url() ) . '?nonce=' . $nonce . '&yoast_qr_code=' . rawurlencode( $url );
		\printf(
			'<div id="yoast_seo_print_qrcode" class="yoast_seo_print_only"><script>' .
				'window.onbeforeprint = function() {' .
					'var img = document.createElement("img");' .
					'img.src = "%4$s"; img.width= "150"; img.height = "150";' .
					'img.alt = "%1$s"; ' .
					'document.getElementById( "yoast_seo_print_qrcode" ).prepend( img );' .
				'};</script><p>%2$s<br/>%3$s</p></div>' . PHP_EOL,
			\esc_attr( $alt_text ),
			\esc_html( $text ),
			\esc_html( $url ),
			\esc_url_raw( $image_url )
		);
	}
}
