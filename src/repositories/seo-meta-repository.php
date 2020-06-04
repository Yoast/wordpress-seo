<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;

/**
 * Class SEO_Meta_Repository
 */
class SEO_Meta_Repository {

	/**
	 * Starts a query for this repository.
	 *
	 * @return ORM
	 */
	public function query() {
		return Model::of_type( 'SEO_Meta' );
	}

	/**
	 * Finds the SEO meta for given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool|Model
	 */
	public function find_by_post_id( $post_id ) {
		return $this->query()
			->where( 'object_id', $post_id )
			->find_one();
	}

	/**
	 * Updates the incoming link count for a post.
	 *
	 * @param int $post_id The post ID.
	 * @param int $count   The count.
	 *
	 * @return bool Whether or not the update was succcessfull.
	 */
	public function update_incoming_link_count( $post_id, $count ) {
		return $this->query()
				->set( 'incoming_link_count', $count )
				->where( 'post_id', $post_id )
				->save();
	}

	/**
	 * Updates the internal link count for a post.
	 *
	 * @param int $post_id The post ID.
	 * @param int $count   The count.
	 *
	 * @return bool Whether or not the update was succcessfull.
	 */
	public function update_internal_link_count( $post_id, $count ) {
		return $this->seo_meta_repository->query()
			->set( 'internal_link_count', $count )
			->where( 'post_id', $post_id )
			->save();
	}
}
