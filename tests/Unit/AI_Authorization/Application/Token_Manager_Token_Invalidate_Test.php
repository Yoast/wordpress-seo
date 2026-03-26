<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

/**
 * The Token_Manager_Token_Invalidate_Test class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager
 */
final class Token_Manager_Token_Invalidate_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests the token_invalidate method of the Token_Manager class.
	 *
	 * @covers ::token_invalidate
	 *
	 * @return void
	 */
	public function test_token_invalidate(): void {
		$user_id    = 123;
		$access_jwt = 'jwt-token';

		$this->access_token_repository
			->shouldReceive( 'get_token' )
			->with( $user_id )
			->andReturn( $access_jwt );

		$this->request_handler
			->shouldReceive( 'handle' )
			->once()
			->withArgs(
				static function ( $request ) use ( $access_jwt, $user_id ) {
					return $request->get_action_path() === '/token/invalidate'
						&& $request->get_body()['user_id'] === (string) $user_id
						&& $request->get_headers()['Authorization'] === "Bearer $access_jwt";
				}
			);

		$this->user_helper
			->shouldReceive( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_access_jwt' )
			->once();
		$this->user_helper
			->shouldReceive( 'delete_meta' )
			->with( $user_id, '_yoast_wpseo_ai_generator_refresh_jwt' )
			->once();

		$this->instance->token_invalidate( $user_id );
	}
}
