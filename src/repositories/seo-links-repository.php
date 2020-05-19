<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\ORM;
use Yoast\WP\Lib\Model;

/**
 * Class SEO_Links_Repository
 */
class SEO_Links_Repository {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'SEO_Links' );
	}
}
