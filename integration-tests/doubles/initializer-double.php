<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\WordPress\Initializer;

class Initializer_Double implements Initializer {

	public static $conditionals = [];

	public static function get_conditionals() {
		return self::$conditionals;
	}

	private $registered = false;

	public function initialize() {
		$this->registered = true;
	}

	public function is_registered() {
		return $this->registered;
	}
}
