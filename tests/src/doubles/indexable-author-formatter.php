<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Formatters\Indexable_Author;

class Indexable_Author_Formatter extends Indexable_Author {
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
