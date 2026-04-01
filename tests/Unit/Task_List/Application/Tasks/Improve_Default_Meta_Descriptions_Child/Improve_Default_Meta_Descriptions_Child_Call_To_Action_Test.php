<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;

/**
 * Tests the get_call_to_action method of the Improve Default Meta Descriptions Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::get_link
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Call_To_Action_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests that get_call_to_action returns a Call_To_Action_Entry with the correct link.
	 *
	 * @return void
	 */
	public function test_get_call_to_action_returns_entry_with_link() {
		$expected_link = 'https://example.com/wp-admin/post.php?post=123&action=edit';

		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 123, '&' )
			->andReturn( $expected_link );

		$call_to_action = $this->instance->get_call_to_action();
		$array          = $call_to_action->to_array();

		$this->assertInstanceOf( Call_To_Action_Entry::class, $call_to_action );
		$this->assertSame( 'Open editor', $array['label'] );
		$this->assertSame( 'link', $array['type'] );
		$this->assertSame( $expected_link, $array['href'] );
	}

	/**
	 * Tests that get_call_to_action returns a Call_To_Action_Entry with null href when link is null.
	 *
	 * @return void
	 */
	public function test_get_call_to_action_returns_entry_with_null_href_when_link_is_null() {
		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 123, '&' )
			->andReturn( null );

		$call_to_action = $this->instance->get_call_to_action();
		$array          = $call_to_action->to_array();

		$this->assertInstanceOf( Call_To_Action_Entry::class, $call_to_action );
		$this->assertSame( 'Open editor', $array['label'] );
		$this->assertSame( 'link', $array['type'] );
		$this->assertNull( $array['href'] );
	}
}
