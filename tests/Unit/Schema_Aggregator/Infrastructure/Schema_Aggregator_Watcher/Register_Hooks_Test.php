<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher;

/**
 * Tests the register_hooks method.
 *
 * @group schema-aggregator
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Aggregator_Watcher::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Schema_Aggregator_Watcher_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_action(
				'update_option_wpseo',
				[ $this->instance, 'check_schema_aggregator_enabled' ]
			)
		);
	}
}
