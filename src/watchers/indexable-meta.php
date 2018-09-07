<?php
/**
 * WordPress Post Meta watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\YoastSEO\Watchers;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Models\Indexable_Meta as Indexable_Meta_Model;
use Yoast\YoastSEO\Yoast_Model;

/**
 * Fills the Indexable Meta according to Post data.
 */
class Indexable_Meta {

	/** @var int */
	protected $indexable_id;

	/**
	 * Indexable_Post_Meta constructor.
	 *
	 * @param int $indexable_id The indexable id.
	 */
	public function __construct( $indexable_id ) {
		$this->indexable_id = $indexable_id;
	}

	/**
	 * Sets specific meta data for an indexable.
	 *
	 * @param string $meta_key   The key to set.
	 * @param string $meta_value The value to set.
	 *
	 * @return void
	 */
	public function set_meta( $meta_key, $meta_value  ) {
		try {
			$indexable_meta = $this->get_indexable_meta( $meta_key );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$indexable_meta->meta_key = $meta_key;
		$indexable_meta->meta_value = $meta_value;
		$indexable_meta->save();
	}

	/**
	 * Fetches the indexable meta for a metafield and indexable.
	 *
	 * @param string $meta_key    The meta key to get object for.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return Indexable_Meta_Model
	 *
	 * @throws No_Indexable_Found Exception when no Indexable entry could be found.
	 */
	protected function get_indexable_meta( $meta_key, $auto_create = true ) {
		$indexable_meta = Yoast_Model::of_type( 'Indexable_Meta' )
		                        ->where( 'indexable_id', $this->indexable_id )
		                        ->where( 'meta_key', $meta_key )
		                        ->find_one();

		if ( $auto_create && ! $indexable_meta ) {
			/**
			 * Indexable instance for the post.
			 *
			 * @var Indexable_Meta_Model $indexable_meta
			 */
			$indexable_meta               = Yoast_Model::of_type( 'Indexable_Meta' )->create();
			$indexable_meta->indexable_id = $this->indexable_id;
			$indexable_meta->meta_key     = $meta_key;
		}

		if ( ! $indexable_meta ) {
			throw No_Indexable_Found::from_meta_key( $meta_key, $this->indexable_id );
		}

		return $indexable_meta;
	}
}
