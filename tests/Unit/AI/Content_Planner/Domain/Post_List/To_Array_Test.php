<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;

/**
 * Tests the Post_List's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List::to_array
 */
final class To_Array_Test extends Abstract_Post_List {

	/**
	 * Tests the to_array method returns an empty array when no posts are added.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame( [], $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method returns the correct array when posts are added.
	 *
	 * @return void
	 */
	public function test_to_array_with_posts() {
		$category = new Category( 'Tech', 5 );
		$post     = new Post(
			'My Post Title',
			'A description of the post.',
			$category,
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);

		$this->instance->add( $post );

		$expected = [
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
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}
}
