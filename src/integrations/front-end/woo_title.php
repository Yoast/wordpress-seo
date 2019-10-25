<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

namespace Yoast\WP\Free\Integrations\Front_End;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;

/**
 * Notify the user by giving a deprecated notice.
 */
class Woo_Title implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'woo_title', [ $this, 'fix_woo_title' ], 99 );
	}

	/**
	 * Filters the title for woo_title.
	 *
	 * @param string $title The title.
	 *
	 * @return string The title.
	 */
	public function fix_woo_title( $title ) {
		_deprecated_function(
			__METHOD__,
			'WPSEO 12.7',
			esc_html(
				sprintf(
					__( 'This theme doesn\'t have proper theme support for %1$s.', 'wp_title' )
				)
			)
		);
		return $title;
	}
}
