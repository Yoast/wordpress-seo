<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Exposes the protected functions of the WPSEO Handle 404 class for testing.
 */
class Expose_WPSEO_Handle_404 extends WPSEO_Handle_404 {

	public function is_feed_404( $handled ) {
		return parent::is_feed_404( $handled );
	}

	public function is_main_feed() {
		return parent::is_main_feed();
	}
}
