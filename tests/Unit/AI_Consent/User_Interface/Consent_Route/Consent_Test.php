<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\Consent_Route;

use Brain\Monkey;
use Mockery;
use WP_REST_Request;
use WP_REST_Response;
use Yoast\WP\SEO\AI_Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI_Consent\Application\Consent_Handler;

/**
 * Tests the Consent_Route's consent method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI_Consent\User_Interface\Consent_Route::consent
 */
final class Consent_Test extends Abstract_Consent_Route_Test {

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The token manager instance.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * Tests the consent method.
	 *
	 * @dataProvider data_consent
	 *
	 * @param bool $consent The value to set.
	 *
	 * @return void
	 */
	public function test_consent( $consent ) {
		// Current user ID is used for the consent permission.
		$user_id = 1;
		Monkey\Functions\expect( 'get_current_user_id' )
			->once()
			->withNoArgs()
			->andReturn( $user_id );

		$wp_rest_request = Mockery::mock( WP_REST_Request::class );
		$wp_rest_request
			->expects( 'get_param' )
			->once()
			->andReturn( $consent );

		$wp_rest_response = Mockery::mock( 'overload:' . WP_REST_Response::class );

		if ( $consent ) {
			$this->consent_handler
				->expects( 'grant_consent' )
				->once()
				->with( $user_id );

			$wp_rest_response
				->expects( '__construct' )
				->with( 'Consent successfully stored.' )
				->once();
		}
		else {
			$this->consent_handler
				->expects( 'revoke_consent' )
				->once()
				->with( $user_id );
			$this->token_manager
				->expects( 'token_invalidate' )
				->once()
				->with( $user_id );

			$wp_rest_response
				->expects( '__construct' )
				->with( 'Consent successfully revoked.' )
				->once();
		}

		$result = $this->instance->consent( $wp_rest_request );

		$this->assertInstanceOf( WP_REST_Response::class, $result );
	}

	/**
	 * Data provider for test_consent.
	 *
	 * @return array<array<bool, int>>
	 */
	public static function data_consent() {
		return [
			'Consent stored'  => [ true ],
			'Consent revoked' => [ false ],
		];
	}
}
