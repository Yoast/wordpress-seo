<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Post;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Post tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Post extends TestCase {

	/**
	 * The category instance.
	 *
	 * @var Category
	 */
	protected $category;

	/**
	 * The instance to test.
	 *
	 * @var Post
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->category = new Category( 'Tech', 5 );
		$this->instance = new Post(
			'My Post Title',
			'A description of the post.',
			$this->category,
			'focus keyword',
			1,
			'2024-01-15',
			'BlogPosting',
		);
	}
}
