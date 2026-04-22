<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;

/**
 * Tests the Content_Suggestion constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion::__construct
 */
final class Constructor_Test extends Abstract_Content_Suggestion {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertSame( 'How to use AI', $this->getPropertyValue( $this->instance, 'title' ) );
		$this->assertSame( 'informational', $this->getPropertyValue( $this->instance, 'intent' ) );
		$this->assertSame( 'This article explains AI usage.', $this->getPropertyValue( $this->instance, 'explanation' ) );
		$this->assertSame( 'AI usage', $this->getPropertyValue( $this->instance, 'keyphrase' ) );
		$this->assertSame( 'Learn how to use AI effectively.', $this->getPropertyValue( $this->instance, 'meta_description' ) );
		$this->assertInstanceOf( Category::class, $this->getPropertyValue( $this->instance, 'category' ) );
	}

	/**
	 * Tests the constructor with the empty-category sentinel.
	 *
	 * @return void
	 */
	public function test_constructor_with_empty_category_sentinel() {
		$empty_category = new Category( '', -1 );
		$instance       = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			$empty_category,
		);

		$this->assertSame( $empty_category, $this->getPropertyValue( $instance, 'category' ) );
	}
}
