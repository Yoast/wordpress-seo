<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authentication\Application\OAuth_Auth_Strategy;

use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Domain\HTTP_Response;

/**
 * Tests for OAuth_Auth_Strategy::revoke_consent().
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI\Authentication\Application\OAuth_Auth_Strategy
 */
final class Revoke_Consent_Test extends Abstract_OAuth_Auth_Strategy_Test {

	/**
	 * Stubs add_query_arg so the user_id query parameter can be asserted on the DELETE URL.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		Functions\stubs(
			[
				'add_query_arg' => static function ( array $args, string $url ): string {
					$separator = ( \strpos( $url, '?' ) === false ) ? '?' : '&';
					return $url . $separator . \http_build_query( $args );
				},
			],
		);
	}

	/**
	 * Tests that revoke_consent dispatches an authenticated DELETE /user/consent, identifying the
	 * user with a query parameter and sending no body.
	 *
	 * @covers ::revoke_consent
	 *
	 * @return void
	 */
	public function test_revoke_consent_dispatches_delete_with_user_id(): void {
		$this->myyoast_client->expects( 'get_site_token' )
			->with( [ 'service:ai:consume' ], 'https://ai.yoa.st' )
			->andReturn( $this->token_set );

		$this->myyoast_client->expects( 'authenticated_request' )
			->with(
				'DELETE',
				'https://ai.yoa.st/api/v1/user/consent?user_id=42',
				$this->token_set,
				Mockery::on(
					function ( array $options ): bool {
						$this->assertArrayNotHasKey( 'body', $options );
						$this->assertSame( 'application/json', ( $options['headers']['Content-Type'] ?? null ) );
						return true;
					},
				),
			)
			->andReturn( new HTTP_Response( 200, [], '' ) );

		$this->instance->revoke_consent( $this->user );
	}
}
