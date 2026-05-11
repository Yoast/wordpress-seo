<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Category;

/**
 * Tests the Category's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Category::to_array
 */
final class To_Array_Test extends Abstract_Category {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$expected = [
			'name' => 'Tech',
			'id'   => 5,
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}
