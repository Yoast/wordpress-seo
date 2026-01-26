<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Usage_Route;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
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
	 * Represents the token manager.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * Represents the request handler.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * Represents the add-on manager.
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

		$this->token_manager   = Mockery::mock( Token_Manager::class );
		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->addon_manager   = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->instance = new Get_Usage_Route(
			$this->token_manager,
			$this->request_handler,
			$this->addon_manager
		);
	}
}
