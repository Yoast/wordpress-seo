<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\WordPress\Integration;

class Integration_Double implements Integration {

	public static $conditionals = [];

	public static function get_conditionals() {
		return self::$conditionals;
	}

	private $registered = false;

	public function register_hooks() {
		$this->registered = true;
	}

	public function is_registered() {
		return $this->registered;
	}
}
