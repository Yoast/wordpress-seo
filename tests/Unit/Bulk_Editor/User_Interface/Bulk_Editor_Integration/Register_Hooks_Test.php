<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

use Brain\Monkey\Actions;
use Brain\Monkey\Filters;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration;

/**
 * Tests the registration of the hooks.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Bulk_Editor_Integration::register_hooks
 */
final class Register_Hooks_Test extends Abstract_Bulk_Editor_Integration_Test {

	/**
	 * Tests the registration of the hooks when not on the bulk editor page.
	 *
	 * @return void
	 */
	public function test_register_hooks_not_on_bulk_editor_page() {
		Filters\expectAdded( 'wpseo_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ] );

		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )
			->once()
			->withNoArgs()
			->andReturn( 'foo' );

		Actions\expectAdded( 'admin_head' )->once()->with( [ $this->instance, 'remove_menu_item' ] );
		Actions\expectAdded( 'admin_enqueue_scripts' )->never();
		Actions\expectAdded( 'in_admin_header' )->never();

		$this->instance->register_hooks();
	}

	/**
	 * Tests the registration of the hooks when on the bulk editor page.
	 *
	 * @return void
	 */
	public function test_register_hooks_on_bulk_editor_page() {
		Filters\expectAdded( 'wpseo_submenu_pages' )->once()->with( [ $this->instance, 'add_page' ] );

		$this->current_page_helper->expects( 'get_current_yoast_seo_page' )
			->once()
			->withNoArgs()
			->andReturn( Bulk_Editor_Integration::PAGE );

		Actions\expectAdded( 'admin_head' )->once()->with( [ $this->instance, 'remove_menu_item' ] );
		Actions\expectAdded( 'admin_enqueue_scripts' )->once()->with( [ $this->instance, 'enqueue_assets' ] );
		Actions\expectAdded( 'in_admin_header' )->once()->with( [ $this->instance, 'remove_notices' ], \PHP_INT_MAX );

		$this->instance->register_hooks();
	}
}
