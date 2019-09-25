<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Class SEO_Meta_Repository
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class SEO_Meta_Repository {

	/**
	 * Starts a query for this repository.
	 *
	 * @return \Yoast\WP\Free\ORM\ORMWrapper
	 */
	public function query() {
		return Yoast_Model::of_type( 'SEO_Meta' );
	}

	/**
	 * Finds the SEO meta for given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return \Yoast\WP\Free\Models\SEO_Meta The SEO meta.
	 */
	public function find_by_post_id( $post_id ) {
		return $this->query()
					->where( 'object_id', $post_id )
					->find_one();
	}
}
