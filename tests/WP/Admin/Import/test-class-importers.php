<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin\Import\Plugins
 */

use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test whether we register our plugin importers.
 */
class WPSEO_Plugin_Importers_Test extends TestCase {

	/**
	 * Makes sure we can get a list of importers.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 */
	public function test_importers() {
		$this->assertCount( 16, WPSEO_Plugin_Importers::get() );
	}
}
