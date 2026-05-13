<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Application\Suggestions_Provider;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\OAuth_Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Response;

/**
 * Tests the Suggestions_Provider's get_suggestions method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI\Generator\Application\Suggestions_Provider::get_suggestions
 */
final class Get_Suggestions_Test extends Abstract_Suggestions_Provider_Test {

	/**
	 * Tests the get_suggestions method.
	 *
	 * @return void
	 */
	public function test_get_suggestions() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$http_response = Mockery::mock( Response::class );

		$this->ai_request_sender_factory->expects( 'create' )->with( $user )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender->expects( 'send' )->once()->andReturn( $http_response );

		$http_response
			->expects( 'get_body' )
			->once()
			->withNoArgs()
			->andReturn( '{"choices":[{"text":"test"}]}' );

		$suggestions_array = $this->instance->get_suggestions(
			$user,
			'test',
			'',
			'',
			'',
			'',
			'',
		);

		$this->assertArrayHasKey( 0, $suggestions_array );
		$this->assertSame( 'test', $suggestions_array[0] );
	}

	/**
	 * Tests that a Forbidden exception is translated into a CONSENT_REVOKED Forbidden_Exception
	 * after revoking the user's consent (the 401-retry logic now lives in Token_Auth_Strategy).
	 *
	 * @return void
	 */
	public function test_get_suggestions_with_forbidden_exception() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$this->ai_request_sender_factory->expects( 'create' )->with( $user )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender->expects( 'send' )->once()->andThrow( new Forbidden_Exception() );

		$this->consent_handler->expects( 'revoke_consent' )
			->once()
			->with( $user->ID );

		$this->expectException( Forbidden_Exception::class );
		$this->expectExceptionMessage( 'CONSENT_REVOKED' );

		$this->instance->get_suggestions(
			$user,
			'test',
			'',
			'',
			'',
			'',
			'',
		);
	}

	/**
	 * An OAuth_Forbidden_Exception (typed wrapper around a non-scope 403 on the OAuth wire) is
	 * propagated unchanged — consent is NOT revoked, since "consent" is a Token-flow concept that
	 * doesn't apply on the OAuth wire.
	 *
	 * @return void
	 */
	public function test_get_suggestions_propagates_oauth_forbidden_without_consent_revoke() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$this->ai_request_sender_factory->expects( 'create' )->with( $user )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender->expects( 'send' )->once()->andThrow( new OAuth_Forbidden_Exception( 'policy', 403, 'policy' ) );

		$this->consent_handler->shouldNotReceive( 'revoke_consent' );

		$this->expectException( OAuth_Forbidden_Exception::class );

		$this->instance->get_suggestions(
			$user,
			'test',
			'',
			'',
			'',
			'',
			'',
		);
	}
}
