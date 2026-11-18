<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Infrastructure\WordPress_Category_Repository;

use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\WordPress_Category_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for WordPress_Category_Repository tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var WordPress_Category_Repository
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new WordPress_Category_Repository();
	}
}
