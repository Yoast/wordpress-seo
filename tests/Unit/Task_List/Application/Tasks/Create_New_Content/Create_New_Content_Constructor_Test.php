<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Create_New_Content;

use Yoast\WP\SEO\Helpers\Post_Type_Helper;

/**
 * Test class for the constructor.
 *
 * @group Create_New_Content
 *
 * @covers Yoast\WP\SEO\Task_List\Application\Tasks\Create_New_Content::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Create_New_Content_Constructor_Test extends Abstract_Create_New_Content_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
	}
}
