<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;

/**
 * Tests the Content_Suggestion's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion::to_array
 */
final class To_Array_Test extends Abstract_Content_Suggestion {

	/**
	 * Tests the to_array method.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$expected = [
			'title'            => 'How to use AI',
			'intent'           => 'informational',
			'explanation'      => 'This article explains AI usage.',
			'keyphrase'        => 'AI usage',
			'meta_description' => 'Learn how to use AI effectively.',
			'category'         => [
				'name' => 'Tech',
				'id'   => 5,
			],
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method without a category.
	 *
	 * @return void
	 */
	public function test_to_array_without_category() {
		$instance = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			null,
		);

		$expected = [
			'title'            => 'How to use AI',
			'intent'           => 'informational',
			'explanation'      => 'This article explains AI usage.',
			'keyphrase'        => 'AI usage',
			'meta_description' => 'Learn how to use AI effectively.',
		];

		$this->assertSame( $expected, $instance->to_array() );
	}
}
