<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Exception;
use Yoast\WP\Free\ORM\Yoast_Model;

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
	 * @return \Yoast\WP\Free\Models\Indexable_Extension The extension.
	 */
	public function get_extension( $name ) {
		if ( ! $this->loaded_extensions[ $name ] ) {
			$class_name = self::$extensions[ $name ];

			$this->loaded_extensions[ $name ] = $this->has_one( $class_name, 'indexable_id', 'id' )->find_one();
		}

		return $this->loaded_extensions[ $name ];
	}

	/**
	 * Enhances the save method.
	 *
	 * @return boolean True on succes.
	 */
	public function save() {
		if ( ! $this->created_at ) {
			$this->created_at = \gmdate( 'Y-m-d H:i:s' );
		}

		if ( $this->updated_at ) {
			$this->updated_at = \gmdate( 'Y-m-d H:i:s' );
		}

		if ( $this->permalink ) {
			$this->permalink      = trailingslashit( $this->permalink );
			$this->permalink_hash = strlen( $this->permalink ) . ':' . md5( $this->permalink );
		}

		$saved = parent::save();

		if ( $saved ) {
			Yoast_Model::$logger->debug(
				\sprintf(
					/* translators: 1: object ID; 2: object type. */
					\__( 'Indexable saved for object %1$s with type %2$s', 'wordpress-seo' ),
					$this->object_id,
					$this->object_type
				),
				\get_object_vars( $this )
			);

			\do_action( 'wpseo_indexable_saved', $this );
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
			Yoast_Model::$logger->debug(
				\sprintf(
					/* translators: 1: object ID; 2: object type. */
					\__( 'Indexable deleted for object %1$s with type %2$s', 'wordpress-seo' ),
					$this->object_id,
					$this->object_type
				),
				\get_object_vars( $this )
			);

			\do_action( 'wpseo_indexable_deleted', $this );
		}

		return $deleted;
	}
}
