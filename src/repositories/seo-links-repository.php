<?php

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\Lib\Model;
use Yoast\WP\Lib\ORM;

/**
 * Class SEO_Links_Repository.
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
	 * Finds all SEO Links by indexable ID.
	 *
	 * @param int $indexable_id The indexable ID.
	 *
	 * @return SEO_Links[] The SEO Links.
	 */
	public function find_all_by_indexable_id( $indexable_id ) {
		return $this->query()
			->where( 'indexable_id', $indexable_id )
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
	 * Clears all SEO Links by post ID where the indexable id is null.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return bool Whether or not the delete was succesfull.
	 */
	public function delete_all_by_post_id_where_indexable_id_null( $post_id ) {
		return $this->query()
			->where( 'post_id', $post_id )
			->where_null( 'indexable_id' )
			->delete_many();
	}

	/**
	 * Clears all SEO Links by indexable ID.
	 *
	 * @param int $indexable_id The indexable ID.
	 *
	 * @return bool Whether or not the delete was succesfull.
	 */
	public function delete_all_by_indexable_id( $indexable_id ) {
		return $this->query()
			->where( 'indexable_id', $indexable_id )
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

	/**
	 * Returns incoming link counts for a number of indexables.
	 *
	 * @param array $indexable_ids The indexable IDs.
	 *
	 * @return array An array of associative arrays, each containing a indexable id and incoming property.
	 */
	public function get_incoming_link_counts_for_indexable_ids( $indexable_ids ) {
		// This query only returns ID's with an incoming count > 0. We need to restore any ID's with 0 incoming links later.
		$indexable_counts = $this->query()
			->select_expr( 'COUNT( id )', 'incoming' )
			->select( 'target_indexable_id' )
			->where_in( 'target_indexable_id', $indexable_ids )
			->group_by( 'target_indexable_id' )
			->find_array();

		// Get all ID's returned from the query for easy accessibility.
		$returned_ids = array_column( $indexable_counts, 'target_indexable_id' );

		// Loop over the original ID's and search them in the returned ID's. If they don't exist, add them with an incoming count of 0.
		foreach ( $indexable_ids as $id ) {
			// Cast the ID to string, as the arrays only contain stringified versions of the ID.
			$id = strval( $id );
			if ( array_search( $id, $returned_ids, true ) === false ) {
				$indexable_counts[] = [
					'incoming'            => '0',
					'target_indexable_id' => $id,
				];
			}
		}

		return $indexable_counts;
	}

	/**
	 * Deletes all seo links for the given ids.
	 *
	 * @param int[] $ids The seo link ids.
	 *
	 * @return bool Whether or not the delete was succesfull.
	 */
	public function delete_many_by_id( $ids ) {
		return $this->query()
			->where_in( 'id', $ids )
			->delete_many();
	}

	/**
	 * Insert multiple seo links.
	 *
	 * @param SEO_Links[] $links The seo links to be inserted.
	 *
	 * @return bool Whether or not the insert was succesfull.
	 */
	public function insert_many( $links ) {
		return $this->query()
			->insert_many( $links );
	}
}
