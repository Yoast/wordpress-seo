<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;

/**
 * Tests the Content_Suggestion_List's add_suggestion method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List::add
 */
final class Add_Suggestion_Test extends Abstract_Content_Suggestion_List {

	/**
	 * Tests the add_suggestion method.
	 *
	 * @return void
	 */
	public function test_add_suggestion() {
		$category   = new Category( 'Tech', 5 );
		$suggestion = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			$category,
		);

		$this->instance->add( $suggestion );

		$suggestions = $this->getPropertyValue( $this->instance, 'content_suggestions' );

		$this->assertArrayHasKey( 0, $suggestions );
		$this->assertInstanceOf( Content_Suggestion::class, $suggestions[0] );
	}
}
