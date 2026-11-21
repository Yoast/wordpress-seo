<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration;

/**
 * Tests handling the bulk action.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\User_Interface\Posts_Overview_Bulk_Actions_Integration::handle_bulk_action
 */
final class Handle_Bulk_Action_Test extends Abstract_Posts_Overview_Bulk_Actions_Integration_Test {

	/**
	 * Tests that another action leaves the redirect URL untouched.
	 *
	 * @return void
	 */
	public function test_leaves_other_actions_alone() {
		$this->assertSame(
			'https://example.com/wp-admin/edit.php',
			$this->instance->handle_bulk_action( 'https://example.com/wp-admin/edit.php', 'trash', [ 1, 2 ] ),
		);
	}

	/**
	 * Tests that without a current screen the redirect URL is left untouched.
	 *
	 * @return void
	 */
	public function test_leaves_the_redirect_alone_without_a_screen() {
		Functions\expect( 'get_current_screen' )->once()->andReturn( null );

		$this->assertSame(
			'https://example.com/wp-admin/edit.php',
			$this->instance->handle_bulk_action( 'https://example.com/wp-admin/edit.php', Posts_Overview_Bulk_Actions_Integration::BULK_ACTION, [ 1 ] ),
		);
	}

	/**
	 * Tests that the action redirects to the bulk editor page with the selection carried over.
	 *
	 * @return void
	 */
	public function test_redirects_to_the_bulk_editor_page_with_the_selection() {
		Functions\expect( 'get_current_screen' )->once()->andReturn( $this->mock_screen( 'post' ) );

		Functions\expect( 'admin_url' )
			->once()
			->with( 'admin.php' )
			->andReturn( 'https://example.com/wp-admin/admin.php' );
		Functions\expect( 'add_query_arg' )
			->once()
			->with(
				[
					'page'           => 'wpseo_page_bulk_edit',
					'content_type'   => 'post',
					'post_ids'       => '5,3',
					'selected_count' => 2,
				],
				'https://example.com/wp-admin/admin.php',
			)
			->andReturn( 'the-bulk-editor-url' );

		// Duplicate, non-numeric, zero and negative IDs are dropped.
		$post_ids = [ '5', 3, 3, 0, -2, 'junk' ];

		$this->assertSame(
			'the-bulk-editor-url',
			$this->instance->handle_bulk_action( 'https://example.com/wp-admin/edit.php', Posts_Overview_Bulk_Actions_Integration::BULK_ACTION, $post_ids ),
		);
	}

	/**
	 * Tests that only the first batch of IDs is carried while the count reflects the whole selection.
	 *
	 * @return void
	 */
	public function test_truncates_the_carried_ids_to_the_batch_limit() {
		Functions\expect( 'get_current_screen' )->once()->andReturn( $this->mock_screen( 'page' ) );

		$post_ids = \range( 1, 25 );

		Functions\expect( 'admin_url' )
			->once()
			->with( 'admin.php' )
			->andReturn( 'https://example.com/wp-admin/admin.php' );
		Functions\expect( 'add_query_arg' )
			->once()
			->with(
				[
					'page'           => 'wpseo_page_bulk_edit',
					'content_type'   => 'page',
					'post_ids'       => \implode( ',', \range( 1, 20 ) ),
					'selected_count' => 25,
				],
				'https://example.com/wp-admin/admin.php',
			)
			->andReturn( 'the-bulk-editor-url' );

		$this->assertSame(
			'the-bulk-editor-url',
			$this->instance->handle_bulk_action( 'https://example.com/wp-admin/edit.php', Posts_Overview_Bulk_Actions_Integration::BULK_ACTION, $post_ids ),
		);
	}

	/**
	 * Tests that without any usable IDs the redirect only carries the content type.
	 *
	 * @return void
	 */
	public function test_redirects_without_ids_when_none_are_usable() {
		Functions\expect( 'get_current_screen' )->once()->andReturn( $this->mock_screen( 'post' ) );

		Functions\expect( 'admin_url' )
			->once()
			->with( 'admin.php' )
			->andReturn( 'https://example.com/wp-admin/admin.php' );
		Functions\expect( 'add_query_arg' )
			->once()
			->with(
				[
					'page'         => 'wpseo_page_bulk_edit',
					'content_type' => 'post',
				],
				'https://example.com/wp-admin/admin.php',
			)
			->andReturn( 'the-bulk-editor-url' );

		$this->assertSame(
			'the-bulk-editor-url',
			$this->instance->handle_bulk_action( 'https://example.com/wp-admin/edit.php', Posts_Overview_Bulk_Actions_Integration::BULK_ACTION, [ 0, 'junk' ] ),
		);
	}
}
