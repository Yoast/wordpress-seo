<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Category;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Category tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Category extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Category
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->instance = new Category( 'Tech', 5 );
	}
}
