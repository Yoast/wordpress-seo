<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Outline_Route;

use Yoast\WP\SEO\Conditionals\AI_Conditional;

/**
 * Tests the Get_Outline_Route get_conditionals method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Outline_Route::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Conditionals_Test extends Abstract_Get_Outline_Route_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [
			AI_Conditional::class,
		];

		$this->assertSame( $expected, $this->instance::get_conditionals() );
	}
}
