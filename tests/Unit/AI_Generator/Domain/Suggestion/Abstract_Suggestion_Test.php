<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Domain\Suggestion;

use Yoast\WP\SEO\AI_Generator\Domain\Suggestion;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Suggestion tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Suggestion_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Suggestion
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Suggestion( 'test' );
	}
}
