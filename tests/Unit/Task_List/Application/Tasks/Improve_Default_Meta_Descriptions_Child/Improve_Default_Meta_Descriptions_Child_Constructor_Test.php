<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Improve_Default_Meta_Descriptions_Child;

use Yoast\WP\SEO\Task_List\Domain\Data\Meta_Description_Content_Item_Data;
use Yoast\WP\SEO\Task_List\Domain\Tasks\Parent_Task_Interface;

/**
 * Test class for the Improve Default Meta Descriptions Child constructor.
 *
 * @group task-list
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Child_Tasks\Improve_Default_Meta_Descriptions_Child::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Improve_Default_Meta_Descriptions_Child_Constructor_Test extends Improve_Abstract_Default_Meta_Descriptions_Child_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Parent_Task_Interface::class,
			$this->getPropertyValue( $this->instance, 'parent_task' ),
		);
		$this->assertInstanceOf(
			Meta_Description_Content_Item_Data::class,
			$this->getPropertyValue( $this->instance, 'content_item_data' ),
		);
	}
}
