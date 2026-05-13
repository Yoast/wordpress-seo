<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\Token_Auth_Strategy;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\Token_Auth_Strategy;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract base for Token_Auth_Strategy tests.
 *
 * @group ai-authentication
 */
abstract class Abstract_Token_Auth_Strategy_Test extends TestCase {

	/**
	 * The Token_Manager mock.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * The Request_Handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The User_Helper mock.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The WP user the request is on behalf of.
	 *
	 * @var WP_User
	 */
	protected $user;

	/**
	 * The instance under test.
	 *
	 * @var Token_Auth_Strategy
	 */
	protected $instance;

	/**
	 * Sets up the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->token_manager   = Mockery::mock( Token_Manager::class );
		$this->request_handler = Mockery::mock( Request_Handler::class );
		$this->user_helper     = Mockery::mock( User_Helper::class );

		$this->user     = new WP_User();
		$this->user->ID = 42;

		$this->instance = new Token_Auth_Strategy( $this->token_manager, $this->request_handler, $this->user_helper );
	}
}
