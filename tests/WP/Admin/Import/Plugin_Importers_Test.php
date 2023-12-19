<?php

namespace Yoast\WP\SEO\Tests\WP\Admin\Import;

use WPSEO_Plugin_Importers;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Test whether we register our plugin importers.
 */
final class Plugin_Importers_Test extends TestCase {

	/**
	 * Makes sure we can get a list of importers.
	 *
	 * @covers WPSEO_Plugin_Importers::get
	 *
	 * @return void
	 */
	public function test_importers() {
		$this->assertCount( 16, WPSEO_Plugin_Importers::get() );
	}
}
