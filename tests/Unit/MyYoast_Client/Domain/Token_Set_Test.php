<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Domain;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Token_Set class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Domain\Token_Set
 */
final class Token_Set_Test extends TestCase {

	/**
	 * Tests that getters return the correct values.
	 *
	 * @covers ::__construct
	 * @covers ::get_access_token
	 * @covers ::get_expires_at
	 * @covers ::get_token_type
	 * @covers ::get_refresh_token
	 * @covers ::get_id_token
	 * @covers ::get_scope
	 * @covers ::get_error_count
	 *
	 * @return void
	 */
	public function test_getters() {
		$token_set = new Token_Set(
			'access-123',
			1_700_000_900,
			'DPoP',
			'refresh-456',
			'id-token-789',
			'openid profile',
			2,
		);

		$this->assertSame( 'access-123', $token_set->get_access_token() );
		$this->assertSame( 1_700_000_900, $token_set->get_expires_at() );
		$this->assertSame( 'DPoP', $token_set->get_token_type() );
		$this->assertSame( 'refresh-456', $token_set->get_refresh_token() );
		$this->assertSame( 'id-token-789', $token_set->get_id_token() );
		$this->assertSame( 'openid profile', $token_set->get_scope() );
		$this->assertSame( 2, $token_set->get_error_count() );
	}

	/**
	 * Tests that is_expired returns true for expired tokens.
	 *
	 * @covers ::is_expired
	 *
	 * @return void
	 */
	public function test_is_expired_returns_true_for_expired() {
		$token_set = new Token_Set( 'token', ( \time() - 100 ) );

		$this->assertTrue( $token_set->is_expired() );
	}

	/**
	 * Tests that is_expired returns true within the 60-second buffer.
	 *
	 * @covers ::is_expired
	 *
	 * @return void
	 */
	public function test_is_expired_returns_true_within_buffer() {
		$token_set = new Token_Set( 'token', ( \time() + 30 ) );

		$this->assertTrue( $token_set->is_expired() );
	}

	/**
	 * Tests that is_expired returns false for non-expired tokens.
	 *
	 * @covers ::is_expired
	 *
	 * @return void
	 */
	public function test_is_expired_returns_false_for_valid() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ) );

		$this->assertFalse( $token_set->is_expired() );
	}

	/**
	 * Tests the to_array and from_array round trip.
	 *
	 * @covers ::to_array
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_to_array_from_array_round_trip() {
		$original = new Token_Set(
			'access',
			1_700_000_900,
			'DPoP',
			'refresh',
			'id-token',
			'openid',
			1,
		);

		$restored = Token_Set::from_array( $original->to_array() );

		$this->assertSame( $original->get_access_token(), $restored->get_access_token() );
		$this->assertSame( $original->get_expires_at(), $restored->get_expires_at() );
		$this->assertSame( $original->get_token_type(), $restored->get_token_type() );
		$this->assertSame( $original->get_refresh_token(), $restored->get_refresh_token() );
		$this->assertSame( $original->get_id_token(), $restored->get_id_token() );
		$this->assertSame( $original->get_scope(), $restored->get_scope() );
		$this->assertSame( $original->get_error_count(), $restored->get_error_count() );
	}

	/**
	 * Tests from_response with a typical token endpoint response.
	 *
	 * @covers ::from_response
	 * @covers ::get_access_token
	 * @covers ::get_token_type
	 * @covers ::get_refresh_token
	 * @covers ::get_id_token
	 * @covers ::get_scope
	 * @covers ::get_expires_at
	 * @covers ::get_error_count
	 *
	 * @return void
	 */
	public function test_from_response() {
		$response = [
			'access_token'  => 'eyJ...',
			'token_type'    => 'DPoP',
			'expires_in'    => 900,
			'refresh_token' => 'opaque-rt',
			'id_token'      => 'eyJ.id.',
			'scope'         => 'licenses:read',
		];

		$token_set = Token_Set::from_response( $response );

		$this->assertSame( 'eyJ...', $token_set->get_access_token() );
		$this->assertSame( 'DPoP', $token_set->get_token_type() );
		$this->assertSame( 'opaque-rt', $token_set->get_refresh_token() );
		$this->assertSame( 'eyJ.id.', $token_set->get_id_token() );
		$this->assertSame( 'licenses:read', $token_set->get_scope() );
		$this->assertEqualsWithDelta( ( \time() + 900 ), $token_set->get_expires_at(), 2 );
		$this->assertSame( 0, $token_set->get_error_count() );
	}

	/**
	 * Tests from_response for a client_credentials response (no refresh_token).
	 *
	 * @covers ::from_response
	 * @covers ::get_refresh_token
	 * @covers ::get_id_token
	 *
	 * @return void
	 */
	public function test_from_response_client_credentials() {
		$response = [
			'access_token' => 'eyJ...',
			'token_type'   => 'DPoP',
			'expires_in'   => 900,
			'scope'        => 'service:licenses:read',
		];

		$token_set = Token_Set::from_response( $response );

		$this->assertNull( $token_set->get_refresh_token() );
		$this->assertNull( $token_set->get_id_token() );
	}

	/**
	 * Tests that with_incremented_error_count returns a new instance.
	 *
	 * @covers ::with_incremented_error_count
	 * @covers ::get_error_count
	 *
	 * @return void
	 */
	public function test_with_incremented_error_count() {
		$original    = new Token_Set( 'token', ( \time() + 3600 ), 'DPoP', 'refresh' );
		$incremented = $original->with_incremented_error_count();

		$this->assertSame( 0, $original->get_error_count() );
		$this->assertSame( 1, $incremented->get_error_count() );
		$this->assertNotSame( $original, $incremented );
	}

	/**
	 * Tests that default values are correct.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_defaults() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ) );

		$this->assertSame( 'DPoP', $token_set->get_token_type() );
		$this->assertNull( $token_set->get_refresh_token() );
		$this->assertNull( $token_set->get_id_token() );
		$this->assertNull( $token_set->get_scope() );
		$this->assertSame( 0, $token_set->get_error_count() );
	}

	/**
	 * Tests that the constructor throws on empty access_token.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_access_token() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'non-empty access_token' );

		new Token_Set( '', ( \time() + 3600 ) );
	}

	/**
	 * Tests that the constructor throws on non-positive expires_at.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_non_positive_expires_at() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'positive expires_at' );

		new Token_Set( 'token', 0 );
	}

	/**
	 * Tests that the constructor throws on empty token_type.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_token_type() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'non-empty token_type' );

		new Token_Set( 'token', ( \time() + 3600 ), '' );
	}

	/**
	 * Tests that from_array throws on missing access_token.
	 *
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_from_array_throws_on_missing_access_token() {
		$this->expectException( InvalidArgumentException::class );

		Token_Set::from_array( [ 'expires_at' => ( \time() + 3600 ) ] );
	}

	/**
	 * Tests that from_array throws on zero expires_at.
	 *
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_from_array_throws_on_zero_expires_at() {
		$this->expectException( InvalidArgumentException::class );

		Token_Set::from_array( [ 'access_token' => 'tok' ] );
	}

	/**
	 * Tests that from_response uses 900s default when expires_in is missing.
	 *
	 * @covers ::from_response
	 * @covers ::get_expires_at
	 * @covers ::is_expired
	 *
	 * @return void
	 */
	public function test_from_response_defaults_expires_in() {
		$token_set = Token_Set::from_response(
			[
				'access_token' => 'tok',
				'token_type'   => 'DPoP',
			],
		);

		$this->assertEqualsWithDelta( ( \time() + 900 ), $token_set->get_expires_at(), 2 );
		$this->assertFalse( $token_set->is_expired() );
	}

	/**
	 * Tests that has_scopes returns true when all required scopes are granted.
	 *
	 * @covers ::has_scopes
	 *
	 * @return void
	 */
	public function test_has_scopes_returns_true_when_all_granted() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ), 'DPoP', null, null, 'openid profile email' );

		$this->assertTrue( $token_set->has_scopes( [ 'openid', 'profile' ] ) );
	}

	/**
	 * Tests that has_scopes returns false when a required scope is missing.
	 *
	 * @covers ::has_scopes
	 *
	 * @return void
	 */
	public function test_has_scopes_returns_false_when_scope_missing() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ), 'DPoP', null, null, 'openid profile' );

		$this->assertFalse( $token_set->has_scopes( [ 'openid', 'email' ] ) );
	}

	/**
	 * Tests that has_scopes returns true for empty required scopes.
	 *
	 * @covers ::has_scopes
	 *
	 * @return void
	 */
	public function test_has_scopes_returns_true_for_empty_required() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ), 'DPoP', null, null, 'openid' );

		$this->assertTrue( $token_set->has_scopes( [] ) );
	}

	/**
	 * Tests that has_scopes returns true for empty required scopes when scope is null.
	 *
	 * @covers ::has_scopes
	 *
	 * @return void
	 */
	public function test_has_scopes_returns_true_for_null_scope_and_empty_required() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ) );

		$this->assertTrue( $token_set->has_scopes( [] ) );
	}

	/**
	 * Tests that has_scopes returns false when scope is null but scopes are required.
	 *
	 * @covers ::has_scopes
	 *
	 * @return void
	 */
	public function test_has_scopes_returns_false_for_null_scope_with_required() {
		$token_set = new Token_Set( 'token', ( \time() + 3600 ) );

		$this->assertFalse( $token_set->has_scopes( [ 'openid' ] ) );
	}
}
