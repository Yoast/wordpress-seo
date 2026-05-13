<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\Get_Usage_Route;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Get_Usage_Route tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Get_Usage_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Get_Usage_Route
	 */
	protected $instance;

	/**
	 * The auth strategy factory mock.
	 *
	 * @var Mockery\MockInterface|AI_Request_Sender_Factory
	 */
	protected $ai_request_sender_factory;

	/**
	 * The auth strategy mock returned by the factory.
	 *
	 * @var Mockery\MockInterface|AI_Request_Sender
	 */
	protected $ai_request_sender;

	/**
	 * The add-on manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->ai_request_sender_factory = Mockery::mock( AI_Request_Sender_Factory::class );
		$this->ai_request_sender         = Mockery::mock( AI_Request_Sender::class );
		$this->addon_manager             = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->ai_request_sender_factory->shouldReceive( 'create' )->andReturn( $this->ai_request_sender )->byDefault();

		$this->instance = new Get_Usage_Route(
			$this->ai_request_sender_factory,
			$this->addon_manager,
		);
	}
}
