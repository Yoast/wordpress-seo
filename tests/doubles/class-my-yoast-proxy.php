<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_MyYoast_Proxy_Double extends WPSEO_MyYoast_Proxy {

	/**
	 * @inheritdoc
	 */
	public function determine_proxy_options() {
		return parent::determine_proxy_options();
	}
}
