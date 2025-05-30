<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Infrastructure\API_Client;

use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for API_Client tests.
 *
 * @group ai-http-request
 */
class Abstract_API_Client_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var API_Client
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->instance = new API_Client();
	}
}
