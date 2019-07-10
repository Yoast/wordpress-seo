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
