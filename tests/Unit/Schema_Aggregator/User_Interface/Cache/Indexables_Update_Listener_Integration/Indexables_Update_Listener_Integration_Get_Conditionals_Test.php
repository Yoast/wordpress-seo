<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;

use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Conditional;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration;

/**
 * Test class for the get_conditionals method.
 *
 * @group schema-aggregator
 * @group Indexables_Update_Listener_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Cache\Indexables_Update_Listener_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Indexables_Update_Listener_Integration_Get_Conditionals_Test extends Abstract_Indexables_Update_Listener_Integration_Test {

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Schema_Aggregator_Conditional::class ],
			Indexables_Update_Listener_Integration::get_conditionals()
		);
	}
}
