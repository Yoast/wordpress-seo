<?php

namespace Yoast\Tests\Doubles;

/**
 * Test Helper Class.
 */
class Database_Migration extends \Yoast\WP\Free\Config\Database_Migration {

	/**
	 * @inheritDoc
	 */
	public function get_charset() {
		return parent::get_charset();
	}

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
