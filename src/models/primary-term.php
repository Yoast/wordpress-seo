<?php
/**
 * Model for the Primary Term table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Primary Term model definition.
 *
 * @property int    $id       Identifier.
 * @property int    $post_id  Post ID.
 * @property int    $term_id  Term ID.
 * @property string $taxonomy Taxonomy.
 *
 * @property string $created_at
 * @property string $updated_at
 */
class Primary_Term extends Yoast_Model {

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

		return parent::save();
	}
}
