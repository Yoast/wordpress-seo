<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Content_SEO_Child;

use Brain\Monkey;
use Yoast\WP\SEO\Task_List\Domain\Components\Call_To_Action_Entry;

/**
 * Tests the get_call_to_action method of the Improve Content SEO Child task.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_call_to_action
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Content_SEO_Child::get_link
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Content_SEO_Child_Call_To_Action_Test extends Abstract_Improve_Content_SEO_Child_Test {

	/**
	 * Tests the get_call_to_action method returns the correct label.
	 *
	 * @return void
	 */
	public function test_get_call_to_action_returns_entry() {
		$expected_link = 'https://example.com/wp-admin/post.php?post=123&action=edit';

		Monkey\Functions\expect( 'get_edit_post_link' )
			->once()
			->with( 123, '&' )
			->andReturn( $expected_link );

		$call_to_action = $this->instance->get_call_to_action();
		$array          = $call_to_action->to_array();

		$this->assertInstanceOf( Call_To_Action_Entry::class, $call_to_action );
		$this->assertSame( 'Improve SEO', $array['label'] );
		$this->assertSame( 'link', $array['type'] );
		$this->assertSame( $expected_link, $array['href'] );
	}
}
