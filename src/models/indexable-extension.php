<?php
/**
 * Abstract class for indexable extensions.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Yoast\WP\Free\Yoast_Model;

/**
 * Indexable_Extension abstract class, intended to be inherited by add-ons to add additional data to Indexables.
 *
 * @package Yoast\WP\Free\Models
 */
abstract class Indexable_Extension extends Yoast_Model {

	/**
	 * @var \Yoast\WP\Free\Models\Indexable
	 */
	protected $indexable = null;

	/**
	 * Returns the indexable this extension belongs to.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The indexable.
	 */
	public function indexable() {
		if ( $this->indexable === null ) {
			$this->indexable = $this->belongs_to( 'Indexable', 'indexable_id', 'id' )->find_one();
		}

		return $this->indexable;
	}
}
