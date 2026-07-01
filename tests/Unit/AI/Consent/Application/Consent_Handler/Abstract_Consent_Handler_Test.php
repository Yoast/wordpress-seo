<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender;
use Yoast\WP\SEO\AI\Authentication\Application\AI_Request_Sender_Factory;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
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
	 * The AI request sender factory instance.
	 *
	 * @var Mockery\MockInterface|AI_Request_Sender_Factory
	 */
	protected $ai_request_sender_factory;

	/**
	 * The AI request sender returned by the factory.
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

		$this->user_helper               = Mockery::mock( User_Helper::class );
		$this->ai_request_sender_factory = Mockery::mock( AI_Request_Sender_Factory::class );
		$this->ai_request_sender         = Mockery::mock( AI_Request_Sender::class );

		$this->instance = new Consent_Handler(
			$this->user_helper,
			$this->ai_request_sender_factory,
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
