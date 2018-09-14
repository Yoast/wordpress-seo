<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Exposes protected defaults from WPSEO_Option_XML class
 */
class WPSEO_Option_XML_Double extends WPSEO_Option_XML {

	public function get_defaults() {
		return $this->defaults;
	}
}
