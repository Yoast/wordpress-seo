<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test whether we register our plugin importers.
 */
class WPSEO_Plugin_Importers_Test extends WPSEO_UnitTestCase {

	/**
	 * Makes sure we can get a list of importers.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importers() {
		$this->assertCount( 16, WPSEO_Plugin_Importers::get() );
	}
}
