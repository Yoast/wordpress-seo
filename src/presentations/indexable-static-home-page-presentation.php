<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

/**
 * Class Indexable_Static_Home_Page_Presentation
 */
class Indexable_Static_Home_Page_Presentation extends Indexable_Post_Type_Presentation {

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		return $this->build_paginated_canonical( true );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_prev() {
		return $this->build_rel_prev( true );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_next() {
		return $this->build_rel_next( true );
	}
}
