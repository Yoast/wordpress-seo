<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Class WPSEO_Configuration_Service_Mock.
 */
class WPSEO_Configuration_Service_Mock extends WPSEO_Configuration_Service {

	/**
	 * Returns a property if that property is set.
	 *
	 * @param string $item Property to get.
	 *
	 * @return mixed|null
	 */
	public function get( $item ) {
		if ( isset( $this->{$item} ) ) {
			return $this->{$item};
		}

		return null;
	}
}
