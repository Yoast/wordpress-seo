<?php

namespace Yoast\WP\Free\Tests\Doubles;

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
	public function set_defines() {
		return parent::set_defines();
	}

	/**
	 * @inheritDoc
	 */
	public function get_defines() {
		return parent::get_defines();
	}
}
