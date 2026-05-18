<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded

namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Content_Planner_Integration;

use Yoast\WP\SEO\Conditionals\AI_Conditional;
use Yoast\WP\SEO\Conditionals\AI_Editor_Conditional;

/**
 * Tests the Content_Planner_Integration get_conditionals method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\User_Interface\Content_Planner_Integration::get_conditionals
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Conditionals_Test extends Abstract_Content_Planner_Integration_Test {

	/**
	 * Tests the get_conditionals method.
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$expected = [
			AI_Conditional::class,
			AI_Editor_Conditional::class,
		];

		$this->assertSame( $expected, $this->instance::get_conditionals() );
	}
}
