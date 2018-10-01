<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Endpoint_Mock
 */
class WPSEO_Configuration_Endpoint_Mock extends WPSEO_Configuration_Endpoint {

	public function get_service() {
		return $this->service;
	}
}
