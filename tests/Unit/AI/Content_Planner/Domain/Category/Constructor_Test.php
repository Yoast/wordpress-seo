<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Category;

/**
 * Tests the Category constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Category::__construct
 */
final class Constructor_Test extends Abstract_Category {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertSame( 'Tech', $this->getPropertyValue( $this->instance, 'name' ) );
		$this->assertSame( 5, $this->getPropertyValue( $this->instance, 'id' ) );
	}
}
