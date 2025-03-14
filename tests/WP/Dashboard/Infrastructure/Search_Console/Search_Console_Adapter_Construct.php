<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Google\Site_Kit\Core\Modules\Module;

/**
 * Test class for the __construct() method.
 *
 * @group search_console_adapter
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Search_Console_Adapter_Construct extends Abstract_Search_Console_Adapter_Test {

	/**
	 * Tests __construct().
	 *
	 * @return void
	 */
	public function test_construct() {
		$module = $this->instance->get_search_console_module();

		$this->assertInstanceOf(
			Module::class,
			$module
		);
	}
}
