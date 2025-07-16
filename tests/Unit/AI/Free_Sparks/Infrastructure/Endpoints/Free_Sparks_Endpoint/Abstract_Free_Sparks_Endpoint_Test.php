<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Unit\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;

use Yoast\WP\SEO\AI\Free_Sparks\Infrastructure\Endpoints\Free_Sparks_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Free_Sparks_Endpoint tests.
 *
 * @group ai-free-sparks
 */
abstract class Abstract_Free_Sparks_Endpoint_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Free_Sparks_Endpoint
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Free_Sparks_Endpoint();
	}
}
