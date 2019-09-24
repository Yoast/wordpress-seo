<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Doubles\Oauth
 */

namespace Yoast\WP\Free\Tests\Doubles\Presenters\Post_Type;

use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\PostType\Robots_Presenter;

/**
 * Test Helper Class.
 */
class Robots_Presenter_Double extends Robots_Presenter {

	/**
	 * Generates the robots output for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The robots output.
	 */
	public function generate( $indexable ) {
		return parent::generate( $indexable );
	}
}
