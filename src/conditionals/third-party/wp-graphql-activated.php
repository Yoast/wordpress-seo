<?php

namespace Yoast\WP\SEO\Conditionals\Third_Party;

use Yoast\WP\SEO\Conditionals\Conditional;

/**
 * Conditional that is met when the GraphQL plugin is installed and activated.
 */
class GraphQL_Activated_Conditional implements Conditional {

	/**
	 * Checks if the WP GraphQL plugin is installed and activated.
	 *
	 * @return bool `true` when the WP GraphQL plugin is installed and activated.
	 */
	public function is_met() {
		return class_exists('WPGraphQL');
	}
}
