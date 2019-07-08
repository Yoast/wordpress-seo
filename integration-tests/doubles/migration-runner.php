<?php

namespace Yoast\WP\Free\Tests\Doubles;

/**
 * Test Helper Class.
 */
class Migration_Runner extends \Yoast\WP\Free\Database\Migration_Runner {

	/**
	 * @inheritDoc
	 */
	public function get_configuration() {
		return parent::get_configuration();
	}

	/**
	 * @inheritDoc
	 */
	public function set_defines( $table_name ) {
		return parent::set_defines( $table_name );
	}

	/**
	 * @inheritDoc
	 */
	public function get_defines( $table_name ) {
		return parent::get_defines( $table_name );
	}
}
