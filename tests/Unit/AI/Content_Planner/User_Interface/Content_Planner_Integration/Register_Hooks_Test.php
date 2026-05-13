<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use Brain\Monkey;

/**
 * Tests the Content_Planner_Integration register_hooks method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::register_hooks
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Register_Hooks_Test extends Abstract_Content_Planner_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )
			->once()
			->with( [ $this->instance, 'enqueue_assets' ] );

		Monkey\Actions\expectAdded( 'elementor/editor/before_enqueue_scripts' )
			->once()
			->with( [ $this->instance, 'enqueue_assets' ], 11 );

		$this->instance->register_hooks();
	}
}
