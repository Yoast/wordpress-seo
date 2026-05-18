<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Infrastructure\Endpoints\Bust_Subscription_Cache_Endpoint;

use Yoast\WP\SEO\AI\Generator\Infrastructure\Endpoints\Bust_Subscription_Cache_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Bust_Subscription_Cache_Endpoint tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Bust_Subscription_Cache_Endpoint_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Bust_Subscription_Cache_Endpoint
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Bust_Subscription_Cache_Endpoint();
	}
}
