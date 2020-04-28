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
 * Class SEO_Meta_Repository
 *
 * @package Yoast\WP\SEO\ORM\Repositories
 */
class SEO_Meta_Repository {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORMWrapper
	 */
	public function query() {
		return Model::of_type( 'SEO_Meta' );
	}

	/**
	 * Finds the SEO meta for given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return \Yoast\WP\SEO\Models\SEO_Meta The SEO meta.
	 */
	public function find_by_post_id( $post_id ) {
		return $this->query()
					->where( 'object_id', $post_id )
					->find_one();
	}
}
