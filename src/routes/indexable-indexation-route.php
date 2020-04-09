<?php
/**
 * Reindexation route for indexables
 *
 * @package Yoast\WP\SEO\Routes\Routes
 */

namespace Yoast\WP\SEO\Routes;

use Yoast\WP\SEO\Conditionals\No_Conditionals;

/**
 * Indexable_Reindexing_Route class
 */
class Indexable_Indexation_Route implements Route_Interface {
	use No_Conditionals;

	/**
	 * @inheritDoc
	 */
	public function register_routes() {

	}
}
