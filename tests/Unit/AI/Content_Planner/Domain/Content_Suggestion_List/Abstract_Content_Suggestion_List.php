<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion_List;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion_List;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Content_Suggestion_List tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Content_Suggestion_List extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Content_Suggestion_List
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->instance = new Content_Suggestion_List();
	}
}
