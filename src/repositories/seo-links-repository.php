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

	/**
	 * Finds all SEO Links by post ID.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return SEO_Links[] The SEO Links.
	 */
	public function find_all_by_post_id( $post_id ) {
		return $this->query()
			->where( 'post_id', $post_id )
			->find_many();
	}

	/**
	 * Clears all SEO Links by post ID.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool Whether or not the delete was succesfull.
	 */
	public function delete_all_by_post_id( $post_id ) {
		return $this->query()
			->where( 'post_id', $post_id )
			->delete_many();
	}

	/**
	 * Returns incoming link counts for a number of posts.
	 *
	 * @param array $post_ids The post IDs.
	 *
	 * @return array An array of associative arrays, each containing a post id and incoming property.
	 */
	public function get_incoming_link_counts_for_post_ids( $post_ids ) {
		return $this->query()
			->select_expr( 'COUNT( id )', 'incoming' )
			->select( 'target_post_id', 'post_id' )
			->where_in( 'target_post_id', $post_ids )
			->group_by( 'target_post_id' )
			->find_array();
	}
}
