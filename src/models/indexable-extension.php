<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\Free\Models;

use Yoast\WP\Free\ORM\Yoast_Model;

/**
 * Abstract class for indexable extensions.
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
