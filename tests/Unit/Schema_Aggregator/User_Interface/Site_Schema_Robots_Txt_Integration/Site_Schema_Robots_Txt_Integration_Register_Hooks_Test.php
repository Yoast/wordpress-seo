<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;

use Brain\Monkey;

/**
 * Test class for the register_hooks method.
 *
 * @group Site_Schema_Robots_Txt_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Robots_Txt_Integration_Register_Hooks_Test extends Abstract_Site_Schema_Robots_Txt_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			Monkey\Actions\has( 'Yoast\WP\SEO\register_robots_rules', [ $this->instance, 'maybe_add_xml_schema_map' ] )
		);
	}
}
