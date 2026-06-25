<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Consent_Handler tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Handler_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Consent_Handler
	 */
	protected $instance;

	/**
	 * The user helper instance.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The token manager instance.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * The request handler instance.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->user_helper     = Mockery::mock( User_Helper::class );
		$this->token_manager   = Mockery::mock( Token_Manager::class );
		$this->request_handler = Mockery::mock( Request_Handler::class );

		$this->instance = new Consent_Handler(
			$this->user_helper,
			$this->token_manager,
			$this->request_handler,
		);
	}

	/**
	 * Stubs WordPress's `get_user_by( 'id', $user_id )` to return a mock WP_User with the given ID.
	 *
	 * @param int $user_id The user ID to set on the mock WP_User.
	 *
	 * @return WP_User|Mockery\MockInterface The mock WP_User returned by the stubbed `get_user_by`.
	 */
	protected function stub_get_user_by( int $user_id ) {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = $user_id;

		Monkey\Functions\expect( 'get_user_by' )
			->once()
			->with( 'id', $user_id )
			->andReturn( $user );

		return $user;
	}

	/**
	 * Stubs WordPress's `get_user_by( 'id', $user_id )` to return `false` (user not found).
	 *
	 * @param int $user_id The user ID to look up.
	 *
	 * @return void
	 */
	protected function stub_get_user_by_not_found( int $user_id ) {
		Monkey\Functions\expect( 'get_user_by' )
			->once()
			->with( 'id', $user_id )
			->andReturn( false );
	}
}
