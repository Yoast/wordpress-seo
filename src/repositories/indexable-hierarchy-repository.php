<?php
/**
 * Yoast extension of the Model class.
 *
 * @package Yoast\YoastSEO\ORM\Repositories
 */

namespace Yoast\WP\SEO\Repositories;

use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Class Indexable_Hierarchy_Repository
 *
 * @package Yoast\WP\SEO\ORM\Repositories
 */
class Indexable_Hierarchy_Repository {

	/**
	 * Removes all ancestors for an indexable.
	 *
	 * @param int $indexable_id The indexable id.
	 *
	 * @return bool Whether or not the indexables were successfully deleted
	 */
	public function clear_ancestors( $indexable_id ) {
		return $this->query()->where( 'indexable_id', $indexable_id )->delete_many();
	}

	/**
	 * Adds an ancestor to an indexable.
	 *
	 * @param int $indexable_id The indexable id.
	 * @param int $ancestor_id  The ancestor id.
	 * @param int $depth        The depth.
	 *
	 * @return bool|Yoast_Model
	 */
	public function add_ancestor( $indexable_id, $ancestor_id, $depth ) {
		$hierarchy = $this->query()->create( [
			'indexable_id' => $indexable_id,
			'ancestor_id'  => $ancestor_id,
			'depth'        => $depth,
		] );
		$hierarchy->save();
		return $hierarchy;
	}

	/**
	 * Starts a query for this repository.
	 *
	 * @return \Yoast\WP\SEO\ORM\ORMWrapper
	 */
	public function query() {
		return Yoast_Model::of_type( 'Indexable_Hierarchy' );
	}
}
