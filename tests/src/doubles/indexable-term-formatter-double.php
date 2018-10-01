<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Formatters\Indexable_Term_Formatter;

class Indexable_Term_Formatter_Double extends Indexable_Term_Formatter {

	/**
	 * @inheritdoc
	 */
	public function get_meta_data() {
		return parent::get_meta_data();
	}

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
