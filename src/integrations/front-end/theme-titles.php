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
class Theme_Titles implements Integration_Interface {

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
		add_filter( 'thematic_doctitle', [ $this, 'title' ], 15 );
		add_filter( 'woo_title', [ $this, 'title' ], 99 );
	}

	/**
	 * Filters the title for thematic_doctitle.
	 *
	 * @deprecated xx.x
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $title The title.
	 *
	 * @return string The title.
	 */
	public function title( $title ) {
		_deprecated_function(
			__METHOD__,
			'WPSEO xx.x',
			esc_html__(
				'a theme that has proper title-tag theme support, or adapt your theme to have that support',
				'wordpress-seo'
			)
		);

		return $title;
	}
}
