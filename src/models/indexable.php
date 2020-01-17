<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\SEO\ORM\Yoast_Model;

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
	 * Whether nor this model uses timestamps.
	 *
	 * @var bool
	 */
	protected $uses_timestamps = true;

	/**
	 * The loaded indexable extensions.
	 *
	 * @var \Yoast\WP\SEO\Models\Indexable_Extension[]
	 */
	protected $loaded_extensions = [];

	/**
	 * Returns an Indexable_Extension by it's name.
	 *
	 * @param string $class_name The class name of the extension to load.
	 *
	 * @return \Yoast\WP\SEO\Models\Indexable_Extension|bool The extension.
	 */
	public function get_extension( $class_name ) {
		if ( ! $this->loaded_extensions[ $class_name ] ) {
			$this->loaded_extensions[ $class_name ] = $this->has_one( $class_name, 'indexable_id', 'id' )->find_one();
		}

		return $this->loaded_extensions[ $class_name ];
	}

	/**
	 * Enhances the save method.
	 *
	 * @return boolean True on succes.
	 */
	public function save() {
		if ( $this->permalink ) {
			$this->permalink      = \trailingslashit( $this->permalink );
			$this->permalink_hash = \strlen( $this->permalink ) . ':' . \md5( $this->permalink );
		}

		return parent::save();
	}
}
