<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\Free\Repositories;

use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Class Primary_Term_Repository
 *
 * @package Yoast\WP\Free\ORM\Repositories
 */
class Primary_Term_Repository extends ORMWrapper {

	/**
	 * Returns the instance of this class constructed through the ORM Wrapper.
	 *
	 * @return Primary_Term_Repository
	 */
	public static function get_instance() {
		ORMWrapper::$repositories[ Yoast_Model::get_table_name( 'Primary_Term' ) ] = self::class;

		return Yoast_Model::of_type( 'Primary_Term' );
	}

	/**
	 * Retrieves an indexable by a post ID and taxonomy.
	 *
	 * @param int    $post_id     The post the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function find_by_postid_and_taxonomy( $post_id, $taxonomy, $auto_create = true ) {
		/** @var \Yoast\WP\Free\Models\Primary_Term $primary_term */
		$primary_term = $this->where( 'post_id', $post_id )
			->where( 'taxonomy', $taxonomy )
			->find_one();

		if ( $auto_create && ! $primary_term ) {
			$primary_term = $this->create();
		}

		return $primary_term;
	}
}
