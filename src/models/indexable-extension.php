<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Abstract class for indexable extensions.
 */
abstract class Indexable_Extension extends Yoast_Model {

	/**
	 * @var \Yoast\WP\SEO\Models\Indexable
	 */
	protected $indexable = null;

	/**
	 * Returns the indexable this extension belongs to.
	 *
	 * @return \Yoast\WP\SEO\Models\Indexable The indexable.
	 */
	public function indexable() {
		if ( $this->indexable === null ) {
			$this->indexable = $this->belongs_to( 'Indexable', 'indexable_id', 'id' )->find_one();
		}

		return $this->indexable;
	}
}
