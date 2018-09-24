<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Exceptions\No_Indexable_Found;
use Yoast\YoastSEO\Yoast_Model;

/**
 * Indexable table definition.
 *
 * @property int     $id
 * @property int     $object_id
 * @property string  $object_type
 * @property string  $object_sub_type
 *
 * @property string  $created_at
 * @property string  $updated_at
 *
 * @property string  $permalink
 * @property string  $canonical
 * @property int     $content_score
 *
 * @property boolean $is_robots_noindex
 * @property boolean $is_robots_nofollow
 * @property boolean $is_robots_noarchive
 * @property boolean $is_robots_noimageindex
 * @property boolean $is_robots_nosnippet
 *
 * @property string  $title
 * @property string  $description
 * @property string  $breadcrumb_title
 *
 * @property boolean $is_cornerstone
 *
 * @property string  $primary_focus_keyword
 * @property int     $primary_focus_keyword_score
 *
 * @property int     $readability_score
 *
 * @property int     $link_count
 * @property int     $incoming_link_count
 */
class Indexable extends Yoast_Model {

	/**
	 * Retrieves an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object id.
	 * @param string $object_type The indexable object type.
	 * @param bool $auto_create   Optional. Create the indexable if it does not exist.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public static function find_by_id_and_type( $object_id, $object_type, $auto_create = true ) {
		$indexable = Yoast_Model::of_type( 'Indexable' )
			->where( 'object_id', $object_id )
			->where( 'object_type', $object_type )
			->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = self::create_for_id_and_type( $object_id, $object_type );
		}

		return $indexable;
	}

	/**
	 * Creates an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object id.
	 * @param string $object_type The indexable object type.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public static function create_for_id_and_type( $object_id, $object_type ) {
		/**
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable              = Yoast_Model::of_type( 'Indexable' )->create();
		$indexable->object_id   = $object_id;
		$indexable->object_type = $object_type;

		return $indexable;
	}

	/**
	 * Returns the related meta model.
	 *
	 * @return Indexable_Meta[] Array of meta objects.
	 * @throws \Exception
	 */
	public function meta() {
		return $this->has_many( 'Indexable_Meta', 'indexable_id', 'id' );
	}

	/**
	 * Enhances the save method.
	 *
	 * @return boolean True on succes.
	 */
	public function save() {
		$saved = parent::save();

		if ( $saved ) {
			do_action( 'wpseo_indexable_saved', $this );
		}

		return $saved;
	}

	/**
	 * Enchances the delete method.
	 *
	 * @return boolean True on success.
	 */
	public function delete() {
		$deleted = parent::delete();

		if ( $deleted ) {
			do_action( 'wpseo_indexable_deleted', $this );
		}

		return $deleted;
	}

	/**
	 * Sets specific meta data for an indexable.
	 *
	 * @param string $meta_key   The key to set.
	 * @param string $meta_value The value to set.
	 *
	 * @return void
	 */
	public function set_meta( $meta_key, $meta_value ) {
		try {
			$indexable_meta = $this->get_meta( $meta_key );
		} catch ( No_Indexable_Found $exception ) {
			return;
		}

		$indexable_meta->meta_key   = $meta_key;
		$indexable_meta->meta_value = $meta_value;
		$indexable_meta->save();
	}
	/**
	 * Fetches the indexable meta for a metafield and indexable.
	 *
	 * @param string $meta_key    The meta key to get object for.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return Indexable_Meta
	 *
	 * @throws No_Indexable_Found Exception when no Indexable entry could be found.
	 */
	protected function get_meta( $meta_key, $auto_create = true ) {
		$indexable_meta = Indexable_Meta::find_meta_for_indexable( $this->id, $meta_key );

		if ( $auto_create && ! $indexable_meta ) {
			$indexable_meta  = Indexable_Meta::create_meta_for_indexable( $this->id, $meta_key );
		}

		if ( ! $indexable_meta ) {
			throw No_Indexable_Found::from_meta_key( $meta_key, $this->id );
		}

		return $indexable_meta;
	}

}
