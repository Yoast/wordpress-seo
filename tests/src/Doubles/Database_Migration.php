<?php

namespace Yoast\Tests\Doubles;

class Database_Migration extends \Yoast\YoastSEO\Config\Database_Migration {

	/**
	 * @inheritdoc
	 */
	public function get_charset() {
		return parent::get_charset();
	}

	/**
	 * @inheritdoc
	 */
	public function get_configuration() {
		return parent::get_configuration();
	}

	/**
	 * @inheritdoc
	 */
	public function set_defines( $table_name ) {
		return parent::set_defines( $table_name );
	}

	public function get_defines( $table_name ) {
		return parent::get_defines( $table_name );
	}
}
