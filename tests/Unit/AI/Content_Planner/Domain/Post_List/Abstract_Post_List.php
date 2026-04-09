<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Post_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Post_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Post_List tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Post_List extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Post_List
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Post_List();
	}
}
