<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Unit test class.
 */
class WPSEO_Plugin_Importers_Test extends WPSEO_UnitTestCase {

	/**
	 * Makes sure WPSEO_Plugin_Importers::$importers is around
	 */
	public function test_importers() {
		$this->assertCount( 7, WPSEO_Plugin_Importers::$importers );
	}

}
