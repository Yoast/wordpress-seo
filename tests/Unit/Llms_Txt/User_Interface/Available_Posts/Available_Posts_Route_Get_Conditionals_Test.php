<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\User_Interface\Available_Posts;

use Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route;

/**
 * Test class for the get_conditionals method.
 *
 * @group available_posts_route
 *
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Available_Posts_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Available_Posts_Route_Get_Conditionals_Test extends Abstract_Available_Posts_Route_Test {

	/**
	 * Tests the get_conditionals function.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Available_Posts_Route::get_conditionals() );
	}
}
