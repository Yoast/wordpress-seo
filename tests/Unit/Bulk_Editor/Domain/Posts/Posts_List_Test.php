<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Posts;

use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Post;
use Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Posts_List.
 *
 * @group bulk-editor
 *
 * @covers Yoast\WP\SEO\Bulk_Editor\Domain\Posts\Posts_List
 */
final class Posts_List_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Posts_List
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Posts_List();
	}

	/**
	 * Tests adding and getting posts.
	 *
	 * @return void
	 */
	public function test_add_and_get() {
		$post = $this->build_post( 1 );

		$this->instance->add( $post );

		$this->assertSame( [ $post ], $this->instance->get() );
	}

	/**
	 * Tests parsing the list to an array.
	 *
	 * @return void
	 */
	public function test_to_array() {
		$this->instance->add( $this->build_post( 1 ) );
		$this->instance->add( $this->build_post( 2 ) );

		$this->assertSame(
			[
				$this->build_post( 1 )->to_array(),
				$this->build_post( 2 )->to_array(),
			],
			$this->instance->to_array(),
		);
	}

	/**
	 * Tests parsing an empty list to an array.
	 *
	 * @return void
	 */
	public function test_to_array_empty() {
		$this->assertSame( [], $this->instance->to_array() );
	}

	/**
	 * Builds a post with the given ID.
	 *
	 * @param int $id The post ID.
	 *
	 * @return Post The post.
	 */
	private function build_post( int $id ): Post {
		return new Post( $id, 'Title', 'publish', 'edit', 'kw', 'seo', 'meta', 'social', 'social desc', true );
	}
}
