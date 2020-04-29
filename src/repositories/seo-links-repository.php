<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\SEO\ORM\ORMWrapper;
use Yoast\WP\Lib\Model;

/**
 * Class SEO_Links_Repository
 *
 * @package Yoast\WP\SEO\ORM\Repositories
 */
class SEO_Links_Repository {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORMWrapper
	 */
	public function query() {
		return Model::of_type( 'SEO_Links' );
	}
}
