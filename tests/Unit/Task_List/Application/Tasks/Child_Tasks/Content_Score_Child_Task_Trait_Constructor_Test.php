<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Child_Tasks;

use Mockery;
use Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Child_Task_Trait;
use Yoast\WP\SEO\Task_List\Domain\Data\Content_Item_Data_Interface;
use Yoast\WP\SEO\Task_List\Domain\Exceptions\Incorrect_Child_Trait_Usage_Exception;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the constructor of the Child_Task_Trait.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Child_Task_Trait::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Content_Score_Child_Task_Trait_Constructor_Test extends TestCase {

	/**
	 * Tests that the constructor throws when the trait is used in a class not extending Abstract_Child_Task.
	 *
	 * @return void
	 */
	public function test_constructor_throws_when_not_child_task() {
		$parent_task       = Mockery::mock( Parent_Task_Interface::class );
		$content_item_data = Mockery::mock( Content_Item_Data_Interface::class );

		$this->expectException( Incorrect_Child_Trait_Usage_Exception::class );

		// @phpcs:ignore Yoast.Files.TestDoubles.SmallTestDouble -- Intentional anonymous class to test trait guard.
		new class($parent_task, $content_item_data) {

			use Child_Task_Trait;
		};
	}
}
