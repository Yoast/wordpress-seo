<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;

/**
 * Tests registering the bulk action on the overview screens.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration::register_bulk_actions
 */
final class Register_Bulk_Actions_Test extends Abstract_Posts_Overview_Bulk_Actions_Integration_Test {

	/**
	 * Tests that nothing is registered when the user cannot manage the SEO options.
	 *
	 * @return void
	 */
	public function test_bails_when_user_lacks_capability() {
		Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$this->content_types_repository->expects( 'get_content_types' )->never();

		Filters\expectAdded( 'bulk_actions-edit-post' )->never();
		Filters\expectAdded( 'handle_bulk_actions-edit-post' )->never();

		$this->instance->register_bulk_actions();
	}

	/**
	 * Tests that the bulk action filters are registered for every supported post type.
	 *
	 * @return void
	 */
	public function test_registers_the_bulk_action_filters_per_supported_post_type() {
		Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->content_types_repository->expects( 'get_content_types' )
			->once()
			->andReturn( $this->content_types_for( [ 'post', 'page' ] ) );

		Filters\expectAdded( 'bulk_actions-edit-post' )->once()->with( [ $this->instance, 'add_bulk_action' ] );
		Filters\expectAdded( 'handle_bulk_actions-edit-post' )->once()->with( [ $this->instance, 'handle_bulk_action' ], 10, 3 );
		Filters\expectAdded( 'bulk_actions-edit-page' )->once()->with( [ $this->instance, 'add_bulk_action' ] );
		Filters\expectAdded( 'handle_bulk_actions-edit-page' )->once()->with( [ $this->instance, 'handle_bulk_action' ], 10, 3 );

		$this->instance->register_bulk_actions();
	}

	/**
	 * Tests that without supported post types no filters are registered.
	 *
	 * @return void
	 */
	public function test_registers_nothing_without_supported_post_types() {
		Functions\expect( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->content_types_repository->expects( 'get_content_types' )
			->once()
			->andReturn( [] );

		Filters\expectAdded( 'bulk_actions-edit-post' )->never();
		Filters\expectAdded( 'handle_bulk_actions-edit-post' )->never();

		$this->instance->register_bulk_actions();
	}
}
