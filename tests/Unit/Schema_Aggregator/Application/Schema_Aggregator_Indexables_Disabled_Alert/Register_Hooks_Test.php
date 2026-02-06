<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert;

/**
 * Tests the register_hooks method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Indexables_Disabled_Alert::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Hooks_Test extends Abstract_Schema_Aggregator_Indexables_Disabled_Alert_Test {

	/**
	 * Tests the register_hooks method.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse(
			\has_action( 'admin_init', [ $this->instance, 'add_notifications' ] )
		);
	}
}
