<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Conditionals\JetPack_Conditional;
use Yoast\WP\SEO\Conditionals\OpenGraph_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Jetpack
 */
class Jetpack implements Integration_Interface {

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class, JetPack_Conditional::class, OpenGraph_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'jetpack_enable_open_graph', '__return_false' );
	}
}
