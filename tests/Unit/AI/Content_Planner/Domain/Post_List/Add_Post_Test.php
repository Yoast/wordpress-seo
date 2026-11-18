<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;

/**
 * Tests the Post_List's add_post method.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List::add
 */
final class Add_Post_Test extends Abstract_Post_List {

	/**
	 * Tests the add_post method.
	 *
	 * @return void
	 */
	public function test_add_post() {
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

		$posts = $this->getPropertyValue( $this->instance, 'posts' );

		$this->assertArrayHasKey( 0, $posts );
		$this->assertInstanceOf( Post::class, $posts[0] );
	}
}
