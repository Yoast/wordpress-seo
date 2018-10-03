<?php
/**
 * Model for the Primary Term table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Yoast_Model;

/**
 * Primary Term model definition.
 *
 * @property int    $id       Identifier.
 * @property int    $post_id  Post ID.
 * @property int    $term_id  Term ID.
 * @property string $taxonomy Taxonomy.
 *
 * @property string  $created_at
 * @property string  $updated_at
 */
class Primary_Term extends Yoast_Model {

	/**
	 * Retrieves an indexable by a post id and taxonomy.
	 *
	 * @param int    $post_id     The post the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return bool|Indexable Instance of indexable.
	 */
	public static function find_by_postid_and_taxonomy( $post_id, $taxonomy, $auto_create = true ) {
		/** @var \Yoast\YoastSEO\Models\Primary_Term $indexable */
		$indexable = Yoast_Model::of_type( 'Primary_Term' )
		                        ->where( 'post_id', $post_id )
		                        ->where( 'taxonomy', $taxonomy )
		                        ->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = Yoast_Model::of_type( 'Primary_Term' )->create();
		}

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

		return parent::save();
	}

}
