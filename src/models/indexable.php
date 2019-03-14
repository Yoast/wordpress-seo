<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Yoast\WP\Free\Exceptions\No_Indexable_Found;
use Yoast\WP\Free\Loggers\Logger;
use Yoast\WP\Free\Yoast_Model;

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
	 * The Indexable meta data.
	 *
	 * @var Indexable_Meta[]
	 */
	protected $meta_data;

	/**
	 * Retrieves an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object id.
	 * @param string $object_type The indexable object type.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
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
		/*
		 * Indexable instance.
		 *
		 * @var Indexable $indexable
		 */
		$indexable              = Yoast_Model::of_type( 'Indexable' )->create();
		$indexable->object_id   = $object_id;
		$indexable->object_type = $object_type;

		Logger::get_logger()->debug(
			sprintf(
				/* translators: 1: object ID; 2: object type. */
				__( 'Indexable created for object %1$s with type %2$s', 'wordpress-seo' ),
				$object_id,
				$object_type
			),
			get_object_vars( $indexable )
		);

		return $indexable;
	}

	/**
	 * Returns the related meta model.
	 *
	 * @return Indexable_Meta Array of meta objects.
	 */
	public function meta() {
		try {
			return $this->has_many( 'Indexable_Meta', 'indexable_id', 'id' );
		}
		catch ( \Exception $exception ) {
			Logger::get_logger()->info( $exception->getMessage() );
		}

		return null;
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
					/* translators: 1: object ID; 2: object type. */
					__( 'Indexable saved for object %1$s with type %2$s', 'wordpress-seo' ),
					$this->object_id,
					$this->object_type
				),
				get_object_vars( $this )
			);

			$this->save_meta();

			do_action( 'wpseo_indexable_saved', $this );
		}

		return $saved;
	}

	/**
	 * Enhances the delete method.
	 *
	 * @return boolean True on success.
	 */
	public function delete() {
		$deleted = parent::delete();

		if ( $deleted ) {
			Logger::get_logger()->debug(
				sprintf(
					/* translators: 1: object ID; 2: object type. */
					__( 'Indexable deleted for object %1$s with type %2$s', 'wordpress-seo' ),
					$this->object_id,
					$this->object_type
				),
				get_object_vars( $this )
			);

			do_action( 'wpseo_indexable_deleted', $this );
		}

		return $deleted;
	}

	/**
	 * Removes the indexable meta.
	 *
	 * @return void
	 */
	public function delete_meta() {
		$meta_data = $this->meta();
		$meta_data = (array) $meta_data->find_many();
		foreach ( $meta_data as $indexable_meta ) {
			$indexable_meta->delete();
		}
	}

	/**
	 * Sets specific meta data for an indexable.
	 *
	 * @param string $meta_key    The key to set.
	 * @param string $meta_value  The value to set.
	 * @param bool   $auto_create Optional. Create the indexable if it does not exist.
	 *
	 * @return void
	 */
	public function set_meta( $meta_key, $meta_value, $auto_create = true ) {
		$meta             = $this->get_meta( $meta_key, $auto_create );
		$meta->meta_value = $meta_value;
	}

	/**
	 * Saves the meta data.
	 *
	 * @return void
	 */
	protected function save_meta() {
		if ( empty( $this->meta_data ) ) {
			return;
		}

		foreach ( $this->meta_data as $meta ) {
			$meta->indexable_id = $this->id;
			$meta->save();
		}
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
		$this->initialize_meta();

		if ( array_key_exists( $meta_key, $this->meta_data ) ) {
			return $this->meta_data[ $meta_key ];
		}

		if ( $auto_create ) {
			$this->meta_data[ $meta_key ] = Indexable_Meta::create_meta_for_indexable( $this->id, $meta_key );

			return $this->meta_data[ $meta_key ];
		}

		throw No_Indexable_Found::from_meta_key( $meta_key, $this->id );
	}

	/**
	 * Initializes the meta data.
	 *
	 * @return void
	 */
	protected function initialize_meta() {
		if ( $this->meta_data !== null ) {
			return;
		}

		$this->meta_data = array();

		$meta_data = $this->meta();
		if ( ! $meta_data ) {
			return;
		}

		try {
			$meta_data = (array) $meta_data->find_many();
			foreach ( $meta_data as $meta ) {
				$this->meta_data[ $meta->meta_key ] = $meta;
			}
		}
		catch ( \Exception $exception ) {
			Logger::get_logger()->info( $exception->getMessage() );
		}
	}
}
