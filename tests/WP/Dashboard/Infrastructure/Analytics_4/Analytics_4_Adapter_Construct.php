<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Analytics_4;

use Google\Site_Kit\Core\Modules\Module;

/**
 * Test class for the __construct() method.
 *
 * @group analytics_4_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Analytics_4_Adapter::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Analytics_4_Adapter_Construct extends Abstract_Analytics_4_Adapter_Test {

	/**
	 * Tests __construct().
	 *
	 * @return void
	 */
	public function test_construct() {
		$module = $this->instance->get_analytics_4_module();

		$this->assertInstanceOf(
			Module::class,
			$module
		);
	}
}
