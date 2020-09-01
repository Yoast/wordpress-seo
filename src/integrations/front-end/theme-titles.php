<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Notify the user by giving a deprecated notice.
 */
class Theme_Titles implements Integration_Interface {

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'thematic_doctitle', [ $this, 'title' ], 15 );
		\add_filter( 'woo_title', [ $this, 'title' ], 99 );
	}

	/**
	 * Filters the title for woo_title and the thematic_doctitle.
	 *
	 * @deprecated 14.0
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $title The title.
	 *
	 * @return string The title.
	 */
	public function title( $title ) {
		\_deprecated_function(
			__METHOD__,
			'WPSEO 14.0',
			\esc_html__(
				'a theme that has proper title-tag theme support, or adapt your theme to have that support',
				'wordpress-seo'
			)
		);

		return $title;
	}
}
