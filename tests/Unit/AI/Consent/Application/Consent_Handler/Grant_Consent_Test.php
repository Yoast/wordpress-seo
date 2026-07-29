<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use RuntimeException;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Internal_Server_Error_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

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
	 * touch the sender factory or local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_throws_if_user_not_found() {
		$user_id = 1;
		$this->stub_get_user_by_not_found( $user_id );

		$this->ai_request_sender_factory->shouldNotReceive( 'create' );
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( RuntimeException::class );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests granting the consent on the happy path: the sender is built for the user, the consent call
	 * succeeds, and the local meta is updated.
	 *
	 * @return void
	 */
	public function test_grant_consent_success() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'grant_consent' )
			->once()
			->with( $user )
			->andReturn( new Response( '{}', 200, 'OK' ) );

		$this->user_helper->expects( 'update_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_consent', true )
			->andReturn( true );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests that grant_consent propagates a Forbidden_Exception thrown by the consent call and does
	 * NOT update the local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_propagates_forbidden_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'grant_consent' )
			->once()
			->with( $user )
			->andThrow( new Forbidden_Exception( 'Forbidden', 403 ) );

		// Local meta must NOT be touched on failure.
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( Forbidden_Exception::class );

		$this->instance->grant_consent( $user_id );
	}

	/**
	 * Tests that grant_consent propagates an Internal_Server_Error_Exception thrown by the consent call
	 * and does NOT update the local meta.
	 *
	 * @return void
	 */
	public function test_grant_consent_propagates_remote_exception() {
		$user_id = 1;
		$user    = $this->stub_get_user_by( $user_id );

		$this->ai_request_sender_factory->expects( 'create' )
			->once()
			->with( $user )
			->andReturn( $this->ai_request_sender );

		$this->ai_request_sender->expects( 'grant_consent' )
			->once()
			->with( $user )
			->andThrow( new Internal_Server_Error_Exception( 'Internal Server Error', 500 ) );

		// Local meta must NOT be touched on failure.
		$this->user_helper->shouldNotReceive( 'update_meta' );

		$this->expectException( Internal_Server_Error_Exception::class );

		$this->instance->grant_consent( $user_id );
	}
}
