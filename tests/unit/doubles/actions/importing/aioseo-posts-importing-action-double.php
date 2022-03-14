<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Posts_Importing_Action;

/**
 * Class Aioseo_Posts_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Posts_Importing_Action_Double extends Aioseo_Posts_Importing_Action {

	/**
	 * Returns the (limited) total number of unimported objects.
	 *
	 * @return int The (limited) total number of unimported objects
	 */
	public function get_total_unindexed() {
		return parent::get_total_unindexed();
	}

	/**
	 * Imports AIOSEO meta data and creates the respective Yoast indexables and postmeta.
	 *
	 * @return void
	 */
	public function index() {
		parent::index();
	}
}
