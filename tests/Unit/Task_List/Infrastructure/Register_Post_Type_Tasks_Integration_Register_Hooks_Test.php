<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Infrastructure;

/**
 * Tests the Register_Post_Type_Tasks_Integration register_hooks.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 *
 * @group Register_Post_Type_Tasks_Integration
 *
 * @covers Yoast\WP\SEO\Task_List\Infrastructure\Register_Post_Type_Tasks_Integration::register_hooks
 */
final class Register_Post_Type_Tasks_Integration_Register_Hooks_Test extends Abstract_Register_Post_Type_Tasks_Integration_Test {

	/**
	 * Tests the registration of the hooks.
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertEquals(
			10,
			\has_filter(
				'wpseo_task_list_tasks',
				[ $this->instance, 'register_post_type_tasks' ]
			)
		);
	}
}
