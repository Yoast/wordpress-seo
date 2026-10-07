<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\WP\Dashboard\Infrastructure\Search_Console;

use Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Api_Call;

/**
 * Test class for the __construct() method.
 *
 * @group search_console_adapter
 *
 * @requires PHP >= 7.4
 *
 * @covers Yoast\WP\SEO\Dashboard\Infrastructure\Search_Console\Site_Kit_Search_Console_Adapter::__construct
 */
final class Construct_Test extends Abstract_Test {

	/**
	 * Tests __construct().
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Site_Kit_Search_Console_Api_Call::class,
			$this->getPropertyValue( $this->instance, 'site_kit_search_console_api_call' ),
		);
	}
}
