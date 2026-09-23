<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Unit\AI_Authorization\Application;

use Brain\Monkey;
use Mockery;
use WP_User;
use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;
use Yoast\WP\SEO\AI_HTTP_Request\Domain\Request;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Abstract_Token_Manager_Test;
/**
 * Tests the token_request method of the Token_Manager class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Token_Manager
 */
final class Token_Manager_Token_Request_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests the token_request method.
	 *
	 * @covers ::token_request
	 *
	 * @return void
	 */
	public function test_token_request() {

		$user             = Mockery::mock( WP_User::class );
		$user->ID         = 1;
		$user->user_email = 'example@example.org';
		$code_challenge   = 'F4k3-C0D3-Ch4ll3ng3';

		$code_verifier_mock = Mockery::mock( Code_Verifier::class );
		$url_helper_mock    = Mockery::mock( Url_Helper::class );

		$container = $this->create_container_with(
			[
				Url_Helper::class          => $url_helper_mock,
			]
		);

		$code_verifier_mock->expects( 'get_code' )
			->times( 2 )
			->andReturn( $code_challenge );
		$code_verifier_mock->expects( 'get_created_at' )
			->once()
			->andReturn( \time() );

		$this->user_helper->expects( 'get_meta' )
			->once()
			->with( $user->ID, '_yoast_wpseo_ai_consent', true )
			->andReturn( '1' );

		$this->code_verifier_handler->expects( 'generate' )
			->once()
			->with( $user->user_email )
			->andReturn( $code_verifier_mock );

		$this->code_verifier_repository->expects( 'store_code_verifier' )
			->once()
			->with( $user->ID, $code_challenge, \time() );

		Monkey\Functions\expect( 'YoastSEO' )
			->once( )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$url_helper_mock->expects( 'network_safe_home_url' )
			->andReturn( 'https://example.com' );

		$this->urls->expects( 'get_callback_url' )
			->once()
			->andReturn( 'https://example.com/callback' );

		$this->urls->expects( 'get_refresh_callback_url' )
			->once()
			->andReturn( 'https://example.com/refresh_callback' );

		$request_body = [
			'service'              => 'openai',
			'code_challenge'       => $code_challenge,
			'license_site_url'     => 'https://example.com',
			'user_id'              => (string) $user->ID,
			'callback_url'         => 'https://example.com/callback',
			'refresh_callback_url' => 'https://example.com/refresh-callback',
		];

		$this->request_handler
			->shouldReceive( 'handle' )
			->once()
			->withArgs(
				static function ( $request ) use ( $code_challenge, $user ) {
					return $request->get_action_path() === '/token/request'
						&& $request->get_body()['service'] === 'openai'
						&& $request->get_body()['code_challenge'] === $code_challenge
						&& $request->get_body()['license_site_url'] === 'https://example.com'
						&& $request->get_body()['user_id'] === (string) $user->ID;
				}
			);

		Monkey\Functions\expect( 'wp_cache_delete' )
			->with( $user->ID, 'user_meta' );

		$this->instance->token_request( $user );
	}
}
