<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;

/**
 * Tests the Content_Suggestion_List's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List::to_array
 */
final class To_Array_Test extends Abstract_Content_Suggestion_List {

	/**
	 * Tests the to_array method returns an empty array when no suggestions are added.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame( [ 'suggestions' => [] ], $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method returns the correct array when suggestions are added.
	 *
	 * @return void
	 */
	public function test_to_array_with_suggestions() {
		$category   = new Category( 'Tech', 5 );
		$suggestion = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			$category,
		);

		$this->instance->add_suggestion( $suggestion );

		$expected = [
			'suggestions' => [
				[
					'title'            => 'How to use AI',
					'intent'           => 'informational',
					'explanation'      => 'This article explains AI usage.',
					'keyphrase'        => 'AI usage',
					'meta_description' => 'Learn how to use AI effectively.',
					'category'         => [
						'name' => 'Tech',
						'id'   => 5,
					],
				],
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}
