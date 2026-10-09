<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;

/**
 * Tests the Post's to_minimal_array method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Post::to_minimal_array
 */
final class To_Minimal_Array_Test extends Abstract_Post {

	/**
	 * Tests that short title and description pass through unchanged.
	 *
	 * @return void
	 */
	public function test_to_minimal_array_with_short_fields() {
		$expected = [
			'title'       => 'My Post Title',
			'description' => 'A description of the post.',
		];

		$this->assertSame( $expected, $this->instance->to_minimal_array() );
	}

	/**
	 * Tests that a description longer than the max is truncated.
	 *
	 * @return void
	 */
	public function test_to_minimal_array_truncates_long_description() {
		$long_description = \str_repeat( 'a', ( Post::MAX_DESCRIPTION_LENGTH + 200 ) );
		$post             = new Post(
			'My Post Title',
			$long_description,
			new Category( 'Tech', 5 ),
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);

		$result = $post->to_minimal_array();

		$this->assertSame( Post::MAX_DESCRIPTION_LENGTH, \mb_strlen( $result['description'], 'UTF-8' ) );
		$this->assertSame( \str_repeat( 'a', Post::MAX_DESCRIPTION_LENGTH ), $result['description'] );
	}

	/**
	 * Tests that a title longer than the max is truncated.
	 *
	 * @return void
	 */
	public function test_to_minimal_array_truncates_long_title() {
		$long_title = \str_repeat( 'b', ( Post::MAX_TITLE_LENGTH + 50 ) );
		$post       = new Post(
			$long_title,
			'A description of the post.',
			new Category( 'Tech', 5 ),
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);

		$result = $post->to_minimal_array();

		$this->assertSame( Post::MAX_TITLE_LENGTH, \mb_strlen( $result['title'], 'UTF-8' ) );
		$this->assertSame( \str_repeat( 'b', Post::MAX_TITLE_LENGTH ), $result['title'] );
	}

	/**
	 * Tests that truncation counts characters, not bytes.
	 *
	 * @return void
	 */
	public function test_to_minimal_array_truncates_multibyte_description_by_characters() {
		// Each "é" is two bytes in UTF-8; truncate must keep 1000 characters, not 1000 bytes.
		$long_description = \str_repeat( 'é', ( Post::MAX_DESCRIPTION_LENGTH + 1 ) );
		$post             = new Post(
			'My Post Title',
			$long_description,
			new Category( 'Tech', 5 ),
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);

		$result = $post->to_minimal_array();

		$this->assertSame( Post::MAX_DESCRIPTION_LENGTH, \mb_strlen( $result['description'], 'UTF-8' ) );
		$this->assertSame( \str_repeat( 'é', Post::MAX_DESCRIPTION_LENGTH ), $result['description'] );
	}
}
