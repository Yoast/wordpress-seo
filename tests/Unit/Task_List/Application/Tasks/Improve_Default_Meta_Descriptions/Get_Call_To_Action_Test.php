<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;

/**
 * Tests the get_call_to_action method of the Improve Default Meta Descriptions task.
 *
 * @group Improve_Default_Meta_Descriptions
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions::get_call_to_action
 */
final class Get_Call_To_Action_Test extends Abstract_Test {

	/**
	 * Tests that get_call_to_action returns a link to the bulk editor with the post type pre-selected.
	 *
	 * @return void
	 */
	public function test_get_call_to_action_returns_link_to_bulk_editor() {
		$this->instance->set_post_type( 'post' );

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->with( 'admin.php?page=wpseo_page_bulk_edit' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit' );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'content_type', 'post', 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit&content_type=post' );

		$call_to_action = $this->instance->get_call_to_action();

		$this->assertInstanceOf( Call_To_Action_Entry::class, $call_to_action );
		$this->assertSame( 'Edit in bulk', $call_to_action->get_label() );
		$this->assertSame( 'link', $call_to_action->get_type() );
		$this->assertSame( 'https://example.com/wp-admin/admin.php?page=wpseo_page_bulk_edit&content_type=post', $call_to_action->get_href() );
	}
}
