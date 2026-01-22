<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\Application\Suggestions_Provider;

use Mockery;
use WP_User;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Response;

/**
 * Tests the Suggestions_Provider's get_suggestions method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider::get_suggestions
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

		$this->token_manager
			->expects( 'get_or_request_access_token' )
			->once()
			->with( $user );

		$this->request_handler
			->expects( 'handle' )
			->once()
			->andReturn( $http_response );

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
			false
		);

		$this->assertArrayHasKey( 0, $suggestions_array );
		$this->assertSame( 'test', $suggestions_array[0] );
	}

	/**
	 * Tests an unauthorized exception.
	 *
	 * @dataProvider data_get_suggestions
	 *
	 * @param bool $retry_on_unauthorized Whether to retry when unauthorized.
	 *
	 * @return void
	 */
	public function test_get_suggestions_with_unauthorized_exception( $retry_on_unauthorized ) {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$call_count = ( $retry_on_unauthorized ) ? 2 : 1;

		$this->token_manager
			->expects( 'get_or_request_access_token' )
			->times( $call_count )
			->with( $user );

		$this->request_handler
			->expects( 'handle' )
			->times( $call_count )
			->andThrow( new Unauthorized_Exception( 'unauthorized' ) );

		$this->user_helper->expects( 'delete_meta' )
			->times( $call_count )
			->with( $user->ID, '_yoast_wpseo_ai_generator_access_jwt' )
			->andReturn( true );

		$this->user_helper->expects( 'delete_meta' )
			->times( $call_count )
			->with( $user->ID, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->andReturn( true );

		$this->expectException( Unauthorized_Exception::class );
		$this->expectExceptionMessage( 'unauthorized' );

		$this->instance->get_suggestions(
			$user,
			'test',
			'',
			'',
			'',
			'',
			'',
			$retry_on_unauthorized
		);
	}

	/**
	 * Data provider for test_get_suggestions.
	 *
	 * @return array<string, array<bool>>
	 */
	public static function data_get_suggestions() {
		return [
			'Retry on unauthorized' => [
				'retry_on_unauthorized' => true,
			],
			'Do not retry on unauthorized' => [
				'retry_on_unauthorized' => false,
			],
		];
	}

	/**
	 * Tests a foridden exception.
	 *
	 * @return void
	 */
	public function test_get_suggestions_with_forbidden_exception() {
		$user     = Mockery::mock( WP_User::class );
		$user->ID = 1;

		$this->token_manager
			->expects( 'get_or_request_access_token' )
			->once()
			->with( $user );

		$this->request_handler
			->expects( 'handle' )
			->once()
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
			false
		);
	}
}
