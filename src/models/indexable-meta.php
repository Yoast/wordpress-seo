<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Loggers\Logger;
use Yoast\YoastSEO\Yoast_Model;

/**
 * Table definition for the Indexable Meta table.
 *
 * @property int    $indexable_id
 * @property string $meta_key
 * @property string $meta_value
 * @property string $created_at
 * @property string $updated_at
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

		Logger::get_logger()->debug(
			sprintf(
				/* translators: 1: ID; 2: value of a meta key. */
				__( 'Indexable meta created for indexable id %1$s with meta key %2$s', 'wordpress-seo' ),
				$indexable_id,
				$meta_key
			),
			get_object_vars( $indexable_meta )
		);

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

	/**
	 * Enhances the save method.
	 *
	 * @return boolean True on succes.
	 */
	public function save() {
		if ( ! $this->created_at ) {
			$this->created_at = gmdate( 'Y-m-d H:i:s' );
		}

		if ( $this->updated_at ) {
			$this->updated_at = gmdate( 'Y-m-d H:i:s' );
		}

		$saved = parent::save();

		if ( $saved ) {
			Logger::get_logger()->debug(
				sprintf(
					/* translators: 1: ID; 2: value of a meta key. */
					__( 'Indexable meta saved for indexable id %1$s with meta key %2$s', 'wordpress-seo' ),
					$this->indexable_id,
					$this->meta_key
				),
				get_object_vars( $this )
			);
		}

		return $saved;
	}

	/**
	 * Enhances the delete method.
	 *
	 * @return boolean True on succes.
	 */
	public function delete() {
		$deleted = parent::delete();

		if ( $deleted ) {
			Logger::get_logger()->debug(
				__( 'Indexable meta deleted.', 'wordpress-seo' ),
				get_object_vars( $this )
			);
		}

		return $deleted;
	}
}
