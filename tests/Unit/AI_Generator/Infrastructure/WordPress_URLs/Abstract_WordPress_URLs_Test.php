<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Infrastructure\WordPress_URLs;

use Yoast\WP\SEO\AI_Generator\Infrastructure\WordPress_URLs;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for WordPress_URLs tests.
 *
 * @group ai-generator
 */
abstract class Abstract_WordPress_URLs_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var WordPress_URLs
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new WordPress_URLs();
	}
}
