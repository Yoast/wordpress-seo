<?php
/**
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

/**
 * Test whether we register our plugin importers.
 */
class WPSEO_Plugin_Importers_Test extends WPSEO_UnitTestCase {

	/**
	 * Makes sure WPSEO_Plugin_Importers::$importers is around
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importers() {
		$this->assertCount( 7, WPSEO_Plugin_Importers::get() );
	}

}
