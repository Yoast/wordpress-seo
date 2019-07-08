<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\Builders\Indexable_Term_Builder;

/**
 * Test Helper Class.
 */
class Indexable_Term_Builder_Double extends Indexable_Term_Builder {

	/**
	 * @inheritdoc
	 */
	public function get_noindex_value( $value ) {
		return parent::get_noindex_value( $value );
	}

	/**
	 * @inheritdoc
	 */
	public function get_keyword_score( $keyword, $score ) {
		return parent::get_keyword_score( $keyword, $score );
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable_lookup() {
		return parent::get_indexable_lookup();
	}

	/**
	 * @inheritdoc
	 */
	public function get_indexable_meta_lookup() {
		return parent::get_indexable_meta_lookup();
	}
}
