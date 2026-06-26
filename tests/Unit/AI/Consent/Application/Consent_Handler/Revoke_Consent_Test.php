<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use RuntimeException;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\WP_Request_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

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
	 * touch the local meta or the sender factory.
	 *
	 * @return void
	 */
	public function test_revoke_consent_throws_if_user_not_found() {
		$user_id = 1;
		$this->stub_get_user_by_not_found( $user_id );

		$this->user_helper->shouldNotReceive( 'delete_meta' );
		$this->ai_request_sender_factory->shouldNotReceive( 'create' );

		$this->expectException( RuntimeException::class );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests revoking the consent on the happy path: local meta is deleted first, then the consent call
	 * succeeds.
	 *
	 * @return void
	 */
	public function test_revoke_consent_success() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'revoke_consent' )
			->once()
			->with( $user )
			->andReturn( new Response( '{}', 200, 'OK' ) );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests that revoke_consent propagates a Remote_Request_Exception thrown by the consent call,
	 * while local meta has already been deleted.
	 *
	 * @return void
	 */
	public function test_revoke_consent_propagates_remote_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'revoke_consent' )
			->once()
			->with( $user )
			->andThrow( new Internal_Server_Error_Exception( 'Internal Server Error', 500 ) );

		$this->expectException( Internal_Server_Error_Exception::class );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests that revoke_consent propagates a Forbidden_Exception thrown by the consent call, while
	 * local meta has already been deleted.
	 *
	 * @return void
	 */
	public function test_revoke_consent_propagates_forbidden_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'revoke_consent' )
			->once()
			->with( $user )
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		$this->expectException( Forbidden_Exception::class );

		$this->instance->revoke_consent( $user_id );
	}

	/**
	 * Tests that revoke_consent propagates a WP_Request_Exception (transport-level error), while
	 * local meta has already been deleted.
	 *
	 * @return void
	 */
	public function test_revoke_consent_propagates_wp_request_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->user_helper->expects( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent' )
			->andReturn( true );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'revoke_consent' )
			->once()
			->with( $user )
			->andThrow( new WP_Request_Exception( 'WP_HTTP_REQUEST_ERROR' ) );

		$this->expectException( WP_Request_Exception::class );

		$this->instance->revoke_consent( $user_id );
	}
}
