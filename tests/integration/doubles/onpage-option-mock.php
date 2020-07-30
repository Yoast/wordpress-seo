<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class Ryte_Option_Mock extends WPSEO_Ryte_Option {

	private $enabled;

	private $status;

	private $can_fetch;

	public function __construct( $enabled, $status, $can_fetch ) {
		$this->enabled   = $enabled;
		$this->status    = $status;
		$this->can_fetch = $can_fetch;
	}

	public function is_enabled() {
		return $this->enabled;
	}

	public function get_status() {
		return $this->status;
	}

	public function should_be_fetched() {
		return $this->can_fetch;
	}
}
