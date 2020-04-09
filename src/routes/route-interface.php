<?php
/**
 * Reindexation route for indexables
 *
 * @package Yoast\YoastSEO\ORM\Routes
 */

namespace Yoast\WP\SEO\Routes;

use Yoast\WP\SEO\Loadable_Interface;

interface Route_Interface extends Loadable_Interface {

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes();
}
