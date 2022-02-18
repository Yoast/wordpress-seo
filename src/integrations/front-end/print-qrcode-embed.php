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
			'<script id="yoast_seo_print_qrcode">' .
				'window.addEventListener( "beforeprint", function() {' .
					'var div = document.createElement( "div" );' .
					'div.innerHTML = "<img src=\"%4$s\" width=\"150\" height=\"150\" alt=\"%1$s\" /><p>%2$s<br/>%3$s</p>";' .
					'div.style = "text-align:center;";' .
					'var script = document.getElementById( "yoast_seo_print_qrcode" );' .
					'script.parentNode.insertBefore( div, script );' .
				'} );' .
			'</script>' . PHP_EOL,
			\esc_attr( $alt_text ),
			\esc_html( $text ),
			\esc_html( $url ),
			\esc_url_raw( $image_url )
		);
	}
}
