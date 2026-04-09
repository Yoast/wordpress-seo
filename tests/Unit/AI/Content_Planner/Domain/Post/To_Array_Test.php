<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;

/**
 * Tests the Post's to_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Post::to_array
 */
final class To_Array_Test extends Abstract_Post {

	/**
	 * Tests the to_array method with schema_article_type set.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$expected = [
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
		];

		$this->assertSame( $expected, $this->instance->to_array() );
	}

	/**
	 * Tests the to_array method without schema_article_type.
	 *
	 * @return void
	 */
	public function test_to_array_without_schema_article_type() {
		$category = new Category( 'Tech', 5 );
		$post     = new Post(
			'My Post Title',
			'A description of the post.',
			$category,
			'focus keyword',
			1,
			'2024-01-15',
			null,
		);

		$expected = [
			'title'                 => 'My Post Title',
			'description'           => 'A description of the post.',
			'category'              => [
				'name' => 'Tech',
				'id'   => 5,
			],
			'primary_focus_keyword' => 'focus keyword',
			'is_cornerstone'        => 1,
			'last_modified'         => '2024-01-15',
		];

		$this->assertSame( $expected, $post->to_array() );
		$this->assertArrayNotHasKey( 'schema_article_type', $post->to_array() );
	}
}
