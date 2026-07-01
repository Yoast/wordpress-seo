<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Route;

use Mockery;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Route;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Consent_Route tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Consent_Route
	 */
	protected $instance;

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The logger instance.
	 *
	 * @var Mockery\MockInterface|Logger
	 */
	protected $logger;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->consent_handler = Mockery::mock( Consent_Handler::class );
		$this->logger          = Mockery::mock( Logger::class );

		$this->instance = new Consent_Route( $this->consent_handler, $this->logger );
	}
}
