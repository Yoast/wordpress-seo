<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Front_End
 */

namespace Yoast\WP\Free\Integrations\Front_End;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Integrations\Integration_Interface;

/**
 * Adds support for shortcodes to category descriptions.
 */
class Category_Description implements Integration_Interface {

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_filter( 'category_description', [ $this, 'add_shortcode_support' ] );
	}

	/**
	 * Adds shortcode support to category descriptions.
	 *
	 * This methods wrap in output buffering to prevent shortcodes that echo stuff
	 * instead of return from breaking things.
	 *
	 * @param string $description String to add shortcodes in.
	 *
	 * @return string Content with shortcodes filtered out.
	 */
	public function add_shortcode_support( $description ) {
		ob_start();
		$description = do_shortcode( $description );
		ob_end_clean();

		return $description;
	}
}
