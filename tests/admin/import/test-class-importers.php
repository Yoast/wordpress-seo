<?php
/**
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit test class.
 */
class WPSEO_Import_External_Importers_Test extends WPSEO_UnitTestCase {

	/**
	 * Makes sure WPSEO_Import_External_Importers::$importers is around
	 */
	public function test_importers() {
		$this->assertCount( 7, WPSEO_Import_External_Importers::$importers );
	}

}
