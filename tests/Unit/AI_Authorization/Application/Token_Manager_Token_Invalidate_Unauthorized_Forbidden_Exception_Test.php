<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Generator;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Forbidden_Exception;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Exceptions\Unauthorized_Exception;

/**
 * Tests the token_invalidate method of the Token_Manager class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager
 */
final class Token_Manager_Token_Invalidate_Unauthorized_Forbidden_Exception_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests the token_invalidate method of the Token_Manager class.
	 *
	 * @covers ::token_invalidate
	 * @dataProvider provide_token_invalidate
	 *
	 * @param Unauthorized_Exception|Forbidden_Exception $exception The exception to test with.
	 *
	 * @return void
	 */
	public function test_token_invalidate_unauthorized_forbidden_exception( $exception ): void {
		$user_id    = 123;
		$access_jwt = 'jwt-token';

		$this->access_token_repository
			->shouldReceive( 'get_token' )
			->with( $user_id )
			->andReturn( $access_jwt );

		$this->request_handler
			->shouldReceive( 'handle' )
			->once()
			->andThrow( new $exception() );

		$this->user_helper
			->shouldReceive( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' );

		$this->user_helper
			->shouldReceive( 'delete_meta' )
			->once()
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' );

		$this->instance->token_invalidate( $user_id );
	}

	/**
	 * Provides data for the test_token_invalidate_unauthorized_forbidden_exception method.
	 *
	 * @return Generator
	 */
	public static function provide_token_invalidate(): Generator {
		yield 'unauthorized exception' => [
			'exception' => new Unauthorized_Exception( 'Unauthorized' ),
		];
		yield 'forbidden exception' => [
			'exception' => new Forbidden_Exception( 'Forbidden' ),
		];
	}
}
