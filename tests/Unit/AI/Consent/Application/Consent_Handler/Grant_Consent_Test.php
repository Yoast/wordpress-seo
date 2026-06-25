<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use Mockery;
use RuntimeException;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Request;

/**
 * Tests the Consent_Handler's grant_consent method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\Application\Consent_Handler::grant_consent
 */
final class Grant_Consent_Test extends Abstract_Consent_Handler_Test {

	/**
	 * Tests that grant_consent throws a RuntimeException when the user is not found, and does not
	 * touch the token manager, request handler, or local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_throws_if_user_not_found() {
		$user_id = 1;
		$this->stub_get_user_by_not_found( $user_id );

		$this->token_manager->shouldNotReceive( 'get_or_request_access_token' );
		$this->request_handler->shouldNotReceive( 'handle' );
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( RuntimeException::class );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests granting the consent on the happy path: token fetched, POST succeeds, local meta updated.
	 *
	 * @return void
	 */
	public function test_grant_consent_success() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->token_manager->expects( 'get_or_request_access_token' )
			->once()
			->with( $user )
			->andReturn( 'jwt-token' );

		$this->request_handler->expects( 'handle' )
			->once()
			->with(
				Mockery::on(
					static function ( $request ) {
						return $request instanceof Request
							&& $request->get_action_path() === '/user/consent'
							&& $request->get_http_method() === Request::METHOD_POST
							&& $request->get_headers() === [ 'Authorization' => 'Bearer jwt-token' ]
							&& $request->get_body() === [ 'user_id' => '1' ];
					},
				),
			);

		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent', true )
			->andReturn( true );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests that grant_consent propagates a Forbidden_Exception thrown while fetching the access token
	 * and does NOT update the local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_propagates_token_fetch_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->token_manager->expects( 'get_or_request_access_token' )
			->once()
			->with( $user )
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		// Local meta must NOT be touched on failure.
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( Forbidden_Exception::class );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests that grant_consent propagates an Internal_Server_Error_Exception thrown by the POST call
	 * and does NOT update the local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_propagates_remote_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->token_manager->expects( 'get_or_request_access_token' )
			->once()
			->with( $user )
			->andReturn( 'jwt-token' );

		$this->request_handler->expects( 'handle' )
			->once()
			->andThrow( new Internal_Server_Error_Exception( 'Internal Server Error', 500 ) );

		// Local meta must NOT be touched on failure.
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( Internal_Server_Error_Exception::class );

		$this->instance->grant_consent( $user_id );
	}
}
