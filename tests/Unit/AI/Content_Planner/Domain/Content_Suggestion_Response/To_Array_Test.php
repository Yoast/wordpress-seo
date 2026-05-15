<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion_Response;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;

/**
 * Tests the Content_Suggestion_Response::to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_Response::to_array
 */
final class To_Array_Test extends Abstract_Content_Suggestion_Response {

	/**
	 * Tests that to_array returns the correct structure when both lists are empty.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame(
			[
				'suggestions'    => [],
				'recent_content' => [],
			],
			$this->instance->to_array(),
		);
	}

	/**
	 * Tests that to_array merges suggestions and recent content into the expected structure.
	 *
	 * @return void
	 */
	public function test_to_array_with_data() {
		$category   = new Category( 'Tech', 5 );
		$suggestion = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			$category,
		);
		$post       = new Post(
			'My Post Title',
			'A description of the post.',
			$category,
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);

		$suggestions    = new Content_Suggestion_List();
		$suggestions->add( $suggestion );

		$recent_content = new Post_List();
		$recent_content->add( $post );

		$instance = new Content_Suggestion_Response( $suggestions, $recent_content );

		$expected = [
			'suggestions'    => [
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
			'recent_content' => [
				[
					'title'                 => 'My Post Title',
					'description'           => 'A description of the post.',
					'category'              => [
						'name' => 'Tech',
						'id'   => 5,
					],
					'primary_focus_keyword' => 'focus keyword',
					'is_cornerstone'        => 1,
					'last_modified'         => '2024-01-15',
					'schema_article_type'   => 'BlogPosting',
				],
			],
		];

		$this->assertSame( $expected, $instance->to_array() );
	}
}
