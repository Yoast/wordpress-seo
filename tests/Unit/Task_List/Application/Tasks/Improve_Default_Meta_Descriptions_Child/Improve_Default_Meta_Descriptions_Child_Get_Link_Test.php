<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Brain\Monkey;

/**
 * Tests the get_link method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_link
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Get_Link_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_link returns the edit post link.
	 *
	 * @return void
	 */
	public function test_get_link_returns_edit_post_link() {
		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 123, '&' )
			->andReturn( 'https://example.com/wp-admin/post.php?post=123&action=edit' );

		$this->assertSame(
			'https://example.com/wp-admin/post.php?post=123&action=edit',
			$this->instance->get_link(),
		);
	}

	/**
	 * Tests that get_link returns null when get_edit_post_link returns null.
	 *
	 * @return void
	 */
	public function test_get_link_returns_null_when_edit_post_link_is_null() {
		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 123, '&' )
			->andReturn( null );

		$this->assertNull( $this->instance->get_link() );
	}
}

