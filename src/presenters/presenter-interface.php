<?php
/**
 * Interface for all presenters.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use Yoast\WP\Free\Models\Indexable;

interface Presenter_Interface {
	/**
	 * Presents an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string HTML to be output on the front-end.
	 */
	public function present( Indexable $indexable );
}
