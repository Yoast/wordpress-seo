<?php

namespace Yoast\WP\Free\Tests\Doubles;

use Yoast\WP\Free\Conditionals\Conditional;

class Conditional_Double implements Conditional {
	private $is_met;

	public function __construct( $is_met ) {
		$this->is_met = $is_met;
	}

	public function is_met() {
		return $this->is_met;
	}
}
