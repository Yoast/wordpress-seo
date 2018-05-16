<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

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
 * @property string  $og_title
 * @property string  $og_image
 * @property string  $og_description
 *
 * @property string  $twitter_title
 * @property string  $twitter_image
 * @property string  $twitter_description
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
	 * Returns the related meta model.
	 *
	 * @return Indexable_Meta[]
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
}
