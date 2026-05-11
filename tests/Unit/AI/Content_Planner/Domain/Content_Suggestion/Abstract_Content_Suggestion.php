<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Content_Suggestion;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Category;
use Yoast\WP\SEO\AI\Content_Planner\Domain\Content_Suggestion;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Content_Suggestion tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Content_Suggestion extends TestCase {

	/**
	 * The category instance.
	 *
	 * @var Category
	 */
	protected $category;

	/**
	 * The instance to test.
	 *
	 * @var Content_Suggestion
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();

		$this->category = new Category( 'Tech', 5 );
		$this->instance = new Content_Suggestion(
			'How to use AI',
			'informational',
			'This article explains AI usage.',
			'AI usage',
			'Learn how to use AI effectively.',
			$this->category,
		);
	}
}
