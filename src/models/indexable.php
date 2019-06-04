<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Exception;
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
 * @property string  $permalink_hash
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
 *
 * @property string  $og_title
 * @property string  $og_description
 * @property string  $og_image
 *
 * @property string  $twitter_title
 * @property string  $twitter_description
 * @property string  $twitter_image
 */
class Indexable extends Yoast_Model {

	/**
	 * The loaded indexable extensions.
	 *
	 * @var Indexable_Extension[]
	 */
	protected $loaded_extensions = [];

	/**
	 * The registered indexable extensions.
	 *
	 * @var Indexable_Extension[]
	 */
	protected static $extensions = [];

	/**
	 * Registers a new indexable extension.
	 *
	 * @param string $name       The name of the extension.
	 * @param string $class_name The class of the extension, must inherit from Indexable_Extension.
	 *
	 * @throws Exception If $class_name does not inherit from Indexable_Extension.
	 */
	public static function register_extension( $name, $class_name ) {
		if ( ! is_subclass_of( $class_name, Indexable_Extension::class ) ) {
			throw new Exception( "$class_name must inherit Indexable_Extension to be registered as an extension." );
		}

		self::$extensions[ $name ] = $class_name;
	}

	/**
	 * Returns an Indexable_Extension by it's name.
	 *
	 * @param string $name The name of the extension to load.
	 *
	 * @return Indexable_Extension The extension.
	 */
	public function get_extension( $name ) {
		if ( ! $this->loaded_extensions[ $name ] ) {
			$class_name = self::$extensions[ $name ];

			$this->loaded_extensions[ $name ] = $this->has_one( $class_name, 'indexable_id', 'id' )->find_one();
		}

		return $this->loaded_extensions[ $name ];
	}

	/**
	 * Retrieves an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object ID.
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
	 * Retrieves an indexable by it's URL.
	 *
	 * @param string $url The indexable url.
	 */
	public static function find_by_url( $url ) {
		$url      = trailingslashit( $url );
		$url_hash = strlen( $url ) . ':' . md5( $url );

		// Find by both url_hash and url, url_hash is indexed so will be used first by the DB to optimize the query.
		return Yoast_Model::of_type( 'Indexable' )
			->where( 'url_hash', $url_hash )
			->where( 'url', $url )
			->find_one();
	}

	/**
	 * Creates an indexable by its ID and type.
	 *
	 * @param int    $object_id   The indexable object ID.
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

		if ( $this->permalink ) {
			$this->permalink      = trailingslashit( $this->permalink );
			$this->permalink_hash = strlen( $this->permalink ) . ':' . md5( $this->permalink );
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
}
