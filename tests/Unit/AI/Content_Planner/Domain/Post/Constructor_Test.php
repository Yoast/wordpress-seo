<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;

/**
 * Tests the Post constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Domain\Post::__construct
 */
final class Constructor_Test extends Abstract_Post {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertSame( 'My Post Title', $this->getPropertyValue( $this->instance, 'title' ) );
		$this->assertSame( 'A description of the post.', $this->getPropertyValue( $this->instance, 'description' ) );
		$this->assertInstanceOf( Category::class, $this->getPropertyValue( $this->instance, 'category' ) );
		$this->assertSame( 'focus keyword', $this->getPropertyValue( $this->instance, 'primary_focus_keyword' ) );
		$this->assertSame( 1, $this->getPropertyValue( $this->instance, 'is_cornerstone' ) );
		$this->assertSame( '2024-01-15', $this->getPropertyValue( $this->instance, 'last_modified' ) );
		$this->assertSame( 'BlogPosting', $this->getPropertyValue( $this->instance, 'schema_article_type' ) );
	}
}
