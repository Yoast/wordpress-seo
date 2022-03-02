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
	 * The maximum length in characted that we're outputting a QR code for.
	 *
	 * @var int
	 */
	const MAX_URL_LENGTH = 2953;

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
	 * Adds script that inserts an `img` tag to the current page for a QR code when printing.
	 *
	 * @return void
	 */
	public function generate_qr_code() {
		$meta = $this->meta_surface->for_current_page();
		$url  = $meta->canonical;

		if ( empty( $url ) ) {
			$url = $meta->indexable->permalink;
		}

		if ( empty( $url ) ) {
			return;
		}

		if ( $this->is_url_too_long( $url ) ) {
			$home_meta = $this->meta_surface->for_home_page();
			$url       = $home_meta->canonical;
		}

		if ( empty( $url ) || $this->is_url_too_long( $url ) ) {
			return;
		}

		$code      = \wp_hash( $url );
		$alt_text  = __( 'QR Code for current page\'s URL.', 'wordpress-seo' );
		$text      = __( 'Scan the QR code or go to the URL below to read this article online.', 'wordpress-seo' );
		$image_url = \trailingslashit( \get_site_url() ) . '?code=' . $code . '&yoast_qr_code=' . rawurlencode( $url );
		\printf(
			'<script id="yoast_seo_print_qrcode_script">' .
				'window.addEventListener( "beforeprint", function() {' .
					'var div = document.createElement( "div" );' .
					'div.innerHTML = "<img src=\"%4$s\" width=\"150\" height=\"150\" alt=\"%1$s\" /><p>%2$s<br/>%3$s</p>";' .
					'div.style = "text-align:center;";' .
					'div.id = "yoast_seo_print_qrcode";' .
					'var script = document.getElementById( "yoast_seo_print_qrcode_script" );' .
					'script.parentNode.insertBefore( div, script );' .
				'} );' .
				'window.addEventListener( "afterprint", function() {' .
					'document.getElementById( "yoast_seo_print_qrcode" ).remove();' .
				'} );' .
			'</script>' . PHP_EOL,
			\esc_attr( $alt_text ),
			\esc_html( $text ),
			\esc_html( $url ),
			\esc_url_raw( $image_url )
		);
	}

	/**
	 * Checks if URL is too long for outputting its QR code.
	 *
	 * @param string $url The url under question.
	 *
	 * @return bool Whether the url is too long for outputting its QR code
	 */
	public function is_url_too_long( $url ) {
		if ( \strlen( $url ) > self::MAX_URL_LENGTH ) {
			return true;
		}

		return false;
	}
}
