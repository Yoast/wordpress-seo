<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generate\User_Interface\Generator_Integration;

use Brain\Monkey;

/**
 * Tests the Generator_Integration's register_hooks method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\User_Interface\Generator_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Generator_Integration_Test {

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
