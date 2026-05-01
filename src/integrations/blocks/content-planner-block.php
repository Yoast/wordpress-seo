<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Registers the Content Planner Banner block.
 */
class Content_Planner_Block implements Integration_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ AI_Conditional::class ];
	}

	/**
	 * Registers hooks for the Content Planner Banner block.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'init', [ $this, 'register_block' ], 11 );
	}
}
