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
	 * Tests that get_link returns the bulk editor URL with the post type pre-selected.
	 *
	 * @return void
	 */
	public function test_get_link_returns_bulk_editor_url_with_post_type() {
		$this->instance->set_post_type( 'post' );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_page_bulk_edit' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit' );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'content_type', 'post', 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit&content_type=post' );

		$this->assertSame(
			'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit&content_type=post',
			$this->instance->get_link(),
		);
	}
}
