<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Brain\Monkey;

/**
 * Tests the get_link method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_link
 */
final class Get_Link_Test extends Abstract_Test {

	/**
	 * Tests that get_link returns the bulk editor URL.
	 *
	 * @return void
	 */
	public function test_get_link_returns_bulk_editor_url() {
		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_page_bulk_edit' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit' );

		$this->assertSame(
			'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit',
			$this->instance->get_link(),
		);
	}
}
