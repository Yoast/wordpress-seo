<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\Builders\Indexable_Author_Builder;

/**
 * Test Helper Class.
 */
class Indexable_Author_Builder_Double extends Indexable_Author_Builder {

	/**
	 * @inheritdoc
	 */
	public function get_meta_data( $user_id ) {
		return parent::get_meta_data( $user_id );
	}

	/**
	 * @inheritdoc
	 */
	public function get_noindex_value( $value ) {
		return parent::get_noindex_value( $value );
	}
}
