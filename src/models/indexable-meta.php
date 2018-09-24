<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Yoast_Model;

/**
 * Table definition for the Indexable Meta table.
 *
 * @property int    $indexable_id
 * @property string $meta_key
 * @property string $meta_value
 */
class Indexable_Meta extends Yoast_Model {

	/**
	 * Retrieves a meta value for an indexable.
	 *
	 * @param int    $indexable_id The indexable id.
	 * @param string $meta_key     The meta key.
	 *
	 * @return bool|Indexable_Meta Indexable meta object.
	 */
	public static function find_meta_for_indexable( $indexable_id, $meta_key ) {
		return Yoast_Model::of_type( 'Indexable_Meta' )
			->where( 'indexable_id', $indexable_id )
			->where( 'meta_key', $meta_key )
			->find_one();
	}

	/**
	 * Creates an indexable meta for an indexable.
	 *
	 * @param int    $indexable_id The indexable id.
	 * @param string $meta_key     The meta key.
	 *
	 * @return bool|Indexable_Meta Indexable meta object.
	 */
	public static function create_meta_for_indexable( $indexable_id, $meta_key ) {
		/**
		 * Indexable instance for the post.
		 *
		 * @var Indexable_Meta $indexable_meta
		 */
		$indexable_meta               = Yoast_Model::of_type( 'Indexable_Meta' )->create();
		$indexable_meta->indexable_id = $indexable_id;
		$indexable_meta->meta_key     = $meta_key;

		return $indexable_meta;
	}

	/**
	 * Returns the indexable object the meta belongs to.
	 *
	 * @return $this|null
	 */
	public function indexable() {
		return $this->belongs_to( 'Indexable' );
	}
}
