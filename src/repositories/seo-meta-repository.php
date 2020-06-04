<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\WP\SEO\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Models\SEO_Meta;

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
	 * @return bool|SEO_Meta The found meta.
	 */
	public function find_by_post_id( $post_id ) {
		return $this->query()
			->where( 'object_id', $post_id )
			->find_one();
	}

	/**
	 * Finds the SEO meta for a list of post IDs.
	 *
	 * @param int $post_ids The post IDs.
	 *
	 * @return bool|SEO_Meta[] The found meta.
	 */
	public function find_by_post_ids( $post_ids ) {
		return $this->query()
			->where_in( 'object_id', $post_ids )
			->find_many();
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
