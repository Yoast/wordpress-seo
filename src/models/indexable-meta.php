<?php
/**
 * Model for the SEO Meta table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\YoastSEO\Models;

use Yoast\YoastSEO\Yoast_Model;

/**
 * Table definition for the Indexable Meta table.
 *
 * @property int    $indexable_id
 * @property string $meta_key
 * @property string $meta_value
 */
class Indexable_Meta extends Yoast_Model {

	/**
	 * Returns the indexable object the meta belongs to.
	 *
	 * @return $this|null
	 */
	public function indexable() {
		return $this->belongs_to( 'Indexable' );
	}
}
