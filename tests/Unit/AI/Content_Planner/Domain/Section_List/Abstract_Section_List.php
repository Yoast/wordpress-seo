<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Section_List tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Section_List extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Section_List
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->instance = new Section_List();
	}
}
