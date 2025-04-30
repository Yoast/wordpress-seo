<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Infrastructure\Browser_Cache;

use Yoast\WP\SEO\Conditionals\Google_Site_Kit_Feature_Conditional;

/**
 * Test class for the constructor.
 *
 * @group Browser_Cache_Configuration
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Browser_Cache\Browser_Cache_Configuration::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Browser_Cache_Configuration_Constructor_Test extends Abstract_Browser_Cache_Configuration_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Google_Site_Kit_Feature_Conditional::class,
			$this->getPropertyValue( $this->instance, 'google_site_kit_feature_conditional' )
		);
	}
}
