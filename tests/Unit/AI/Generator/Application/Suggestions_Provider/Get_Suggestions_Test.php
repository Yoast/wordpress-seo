<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Application\Suggestions_Provider;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI\Generator\Domain\Suggestions_Parameters;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI\HTTP_Request\Domain\Exceptions\Insufficient_Scope_Exception;
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
		$this->ai_request_sender
			->expects( 'get_suggestions' )
			->once()
			->with(
				Mockery::on(
					static function ( $parameters ) use ( $user ) {
						return self::parameters_match_expected_shape( $parameters, $user );
					},
				),
			)
			->andReturn( $http_response );

		$http_response
			->expects( 'get_body' )
			->once()
			->withNoArgs()
			->andReturn( '{"choices":[{"text":"test"}]}' );

		$suggestions_array = $this->instance->get_suggestions(
			$user,
			'seo-title',
			'The article excerpt.',
			'AI usage',
			'en_US',
			'web',
			'gutenberg',
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
		$this->ai_request_sender
			->expects( 'get_suggestions' )
			->once()
			->with( Mockery::type( Suggestions_Parameters::class ) )
			->andThrow( new Forbidden_Exception() );

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
			false,
		);
	}

	/**
	 * An Insufficient_Scope_Exception is propagated unchanged — a scope failure is a deployment/
	 * token-issuance problem, so consent is NOT revoked even though the class extends Forbidden_Exception.
	 *
	 * @return void
	 */
	public function test_get_suggestions_propagates_insufficient_scope_without_consent_revoke() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$this->ai_request_sender_factory->expects( 'create' )->with( $user )->andReturn( $this->ai_request_sender );
		$this->ai_request_sender
			->expects( 'get_suggestions' )
			->once()
			->with( Mockery::type( Suggestions_Parameters::class ) )
			->andThrow( new Insufficient_Scope_Exception( 'INSUFFICIENT_SCOPE', 403, 'INSUFFICIENT_SCOPE' ) );

		$this->consent_handler->shouldNotReceive( 'revoke_consent' );

		$this->expectException( Insufficient_Scope_Exception::class );

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
	 * Asserts that the given parameters match what get_suggestions was invoked with on the happy path.
	 *
	 * @param mixed   $parameters The parameters to inspect.
	 * @param WP_User $user       The expected user.
	 *
	 * @return bool True when the parameters match the expected shape.
	 */
	private static function parameters_match_expected_shape( $parameters, WP_User $user ): bool {
		if ( ! $parameters instanceof Suggestions_Parameters ) {
			return false;
		}

		return $parameters->get_user() === $user
			&& $parameters->get_suggestion_type() === 'seo-title'
			&& $parameters->get_prompt_content() === 'The article excerpt.'
			&& $parameters->get_focus_keyphrase() === 'AI usage'
			&& $parameters->get_language() === 'en_US'
			&& $parameters->get_platform() === 'web'
			&& $parameters->get_editor() === 'gutenberg';
	}
}
