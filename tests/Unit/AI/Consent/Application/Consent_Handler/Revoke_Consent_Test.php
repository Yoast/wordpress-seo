<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use RuntimeException;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;

/**
 * Tests the Consent_Handler's revoke_consent method.
 *
 * @group ai-consent
 *
 * @covers \Yoast\WP\SEO\AI\Consent\Application\Consent_Handler::revoke_consent
 */
final class Revoke_Consent_Test extends Abstract_Consent_Handler_Test {

	/**
	 * Tests that revoke_consent throws a RuntimeException when the user is not found, and does not
	 * touch the local meta or the token manager.
	 *
	 * @return void
	 */
	public function test_revoke_consent_throws_if_user_not_found() {
		$user_id = 1;
		$this->stub_get_user_by_not_found( $user_id );

		$this->user_helper->shouldNotReceive( 'delete_meta' );
		$this->token_manager->shouldNotReceive( 'token_invalidate' );

		$this->expectException( RuntimeException::class );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests revoking the consent on the happy path: local meta is deleted first, then the Yoast AI
	 * connection is invalidated (which revokes consent and invalidates the JWT tokens remotely).
	 *
	 * @return void
	 */
	public function test_revoke_consent_success() {
		$user_id = 1;
		$this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->token_manager->expects( 'token_invalidate' )
			->once()
			->with( $user_id );

		// The remote revocation is fully delegated to the token manager; no request is built here.
		$this->request_handler->shouldNotReceive( 'handle' );
		$this->token_manager->shouldNotReceive( 'get_or_request_access_token' );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests that revoke_consent propagates a Remote_Request_Exception thrown while invalidating the
	 * Yoast AI connection, while the local meta has already been deleted.
	 *
	 * @return void
	 */
	public function test_revoke_consent_propagates_remote_exception() {
		$user_id = 1;
		$this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->token_manager->expects( 'token_invalidate' )
			->once()
			->with( $user_id )
			->andThrow( new Internal_Server_Error_Exception( 'Internal Server Error', 500 ) );

		$this->expectException( Internal_Server_Error_Exception::class );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests that revoke_consent propagates a RuntimeException thrown while invalidating the Yoast AI
	 * connection, while the local meta has already been deleted.
	 *
	 * @return void
	 */
	public function test_revoke_consent_propagates_runtime_exception() {
		$user_id = 1;
		$this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->token_manager->expects( 'token_invalidate' )
			->once()
			->with( $user_id )
			->andThrow( new RuntimeException( 'unexpected programmer error' ) );

		$this->expectException( RuntimeException::class );

		$this->instance->revoke_consent( $user_id );
	}
}
