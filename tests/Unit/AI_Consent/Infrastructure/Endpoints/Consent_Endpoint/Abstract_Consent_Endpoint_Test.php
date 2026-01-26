<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint;

use Yoast\WP\SEO\AI_Consent\Infrastructure\Endpoints\Consent_Endpoint;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Consent_Endpoint tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Endpoint_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Consent_Endpoint
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->instance = new Consent_Endpoint();
	}
}
