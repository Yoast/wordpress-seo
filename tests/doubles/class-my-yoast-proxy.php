<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_My_Yoast_Proxy_Double extends WPSEO_My_Yoast_Proxy {

	/**
	 * @inheritdoc
	 */
	public function determine_proxy_options() {
		return parent::determine_proxy_options();
	}
}
