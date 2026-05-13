<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Application\Suggestions_Provider;

use Mockery;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Suggestions_Provider tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Suggestions_Provider_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Suggestions_Provider
	 */
	protected $instance;

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The auth strategy factory instance.
	 *
	 * @var Mockery\MockInterface|AI_Request_Sender_Factory
	 */
	protected $ai_request_sender_factory;

	/**
	 * The auth strategy returned by the factory.
	 *
	 * @var Mockery\MockInterface|AI_Request_Sender
	 */
	protected $ai_request_sender;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->consent_handler           = Mockery::mock( Consent_Handler::class );
		$this->ai_request_sender_factory = Mockery::mock( AI_Request_Sender_Factory::class );
		$this->ai_request_sender         = Mockery::mock( AI_Request_Sender::class );
		$this->ai_request_sender_factory->shouldReceive( 'create' )->andReturn( $this->ai_request_sender )->byDefault();

		$this->instance = new Suggestions_Provider(
			$this->consent_handler,
			$this->ai_request_sender_factory,
		);
	}
}
