<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Domain\Section;

use Yoast\WP\SEO\AI\Content_Planner\Domain\Section;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Section tests.
 *
 * @group ai-content-planner
 */
abstract class Abstract_Section extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Section
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Section(
			'Understanding Your Child\'s Needs',
			[
				'Assess your child\'s developmental stage.',
				'Consider any specific requirements.',
			],
		);
	}
}
