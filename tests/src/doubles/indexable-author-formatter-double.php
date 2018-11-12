<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Formatters\Indexable_Author_Formatter;

class Indexable_Author_Formatter_Double extends Indexable_Author_Formatter {
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
}
