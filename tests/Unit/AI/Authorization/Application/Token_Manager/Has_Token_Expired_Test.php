<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode -- Reason: Used for legitimate JWT testing, not obfuscation.
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Token_Manager;

/**
 * Class Has_Token_Expired_Test.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI\Authorization\Application\Token_Manager::has_token_expired
 */
final class Has_Token_Expired_Test extends Abstract_Token_Manager_Test {

	/**
	 * Tests has_token_expired with a valid non-expired JWT token.
	 *
	 * @return void
	 */
	public function test_has_token_expired_valid_non_expired_token() {
		// Create a JWT payload with expiration time in the future.
		$future_timestamp = ( \time() + 3600 ); // 1 hour from now.
		$payload          = \json_encode( [ 'exp' => $future_timestamp ] );

		$encoded_payload = \base64_encode( $payload );

		// Create a mock JWT (header.payload.signature).
		$jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertFalse( $result );
	}

	/**
	 * Tests has_token_expired with a valid expired JWT token.
	 *
	 * @return void
	 */
	public function test_has_token_expired_valid_expired_token() {
		// Create a JWT payload with expiration time in the past.
		$past_timestamp  = ( \time() - 3600 ); // 1 hour ago.
		$payload         = \json_encode( [ 'exp' => $past_timestamp ] );
		$encoded_payload = \base64_encode( $payload );

		// Create a mock JWT (header.payload.signature).
		$jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with a JWT token expiring exactly now.
	 *
	 * @return void
	 */
	public function test_has_token_expired_token_expiring_now() {
		// Create a JWT payload with expiration time exactly now.
		$current_timestamp = \time();
		$payload           = \json_encode( [ 'exp' => $current_timestamp ] );
		$encoded_payload   = \base64_encode( $payload );

		// Create a mock JWT (header.payload.signature).
		$jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertFalse( $result );
	}

	/**
	 * Tests has_token_expired with malformed JWT (not 3 parts).
	 *
	 * @return void
	 */
	public function test_has_token_expired_malformed_jwt_wrong_parts() {
		// JWT with only 2 parts.
		$jwt = 'header.payload';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having 4 parts.
	 *
	 * @return void
	 */
	public function test_has_token_expired_jwt_with_four_parts() {
		// JWT with 4 parts.
		$jwt = 'header.payload.signature.extra';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with empty JWT string.
	 *
	 * @return void
	 */
	public function test_has_token_expired_empty_jwt() {
		$jwt = '';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having invalid base64 payload.
	 *
	 * @return void
	 */
	public function test_has_token_expired_invalid_base64_payload() {
		$jwt = 'header.invalid_base64_!@#.signature';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having valid base64 but invalid JSON payload.
	 *
	 * @return void
	 */
	public function test_has_token_expired_invalid_json_payload() {
		$invalid_json    = 'invalid json content';
		$encoded_payload = \base64_encode( $invalid_json );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having valid JSON but no exp field.
	 *
	 * @return void
	 */
	public function test_has_token_expired_no_exp_field() {
		$payload         = \json_encode(
			[
				'sub'  => '1234567890',
				'name' => 'John Doe',
			]
		);
		$encoded_payload = \base64_encode( $payload );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having exp field as null.
	 *
	 * @return void
	 */
	public function test_has_token_expired_exp_field_null() {
		$payload         = \json_encode( [ 'exp' => null ] );
		$encoded_payload = \base64_encode( $payload );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having exp field as string.
	 *
	 * @return void
	 */
	public function test_has_token_expired_exp_field_as_string() {
		$future_timestamp = ( \time() + 3600 );
		$payload          = \json_encode( [ 'exp' => (string) $future_timestamp ] );
		$encoded_payload  = \base64_encode( $payload );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertFalse( $result );
	}

	/**
	 * Tests has_token_expired with JWT having exp field as invalid string.
	 *
	 * @return void
	 */
	public function test_has_token_expired_exp_field_invalid_string() {
		$payload         = \json_encode( [ 'exp' => 'not_a_timestamp' ] );
		$encoded_payload = \base64_encode( $payload );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having exp field as zero.
	 *
	 * @return void
	 */
	public function test_has_token_expired_exp_field_zero() {
		$payload         = \json_encode( [ 'exp' => 0 ] );
		$encoded_payload = \base64_encode( $payload );

		$jwt = "header.{$encoded_payload}.signature";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT containing only dots.
	 *
	 * @return void
	 */
	public function test_has_token_expired_only_dots() {
		$jwt = '..';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with JWT having empty payload section.
	 *
	 * @return void
	 */
	public function test_has_token_expired_empty_payload_section() {
		$jwt = 'header..signature';

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with a realistic JWT structure but expired.
	 *
	 * @return void
	 */
	public function test_has_token_expired_realistic_expired_jwt() {
		// Create a more realistic payload structure.
		$past_timestamp  = ( \time() - 1800 ); // 30 minutes ago.
		$payload         = \json_encode(
			[
				'iss'   => 'yoast-ai-service',
				'sub'   => '123',
				'aud'   => 'wordpress-seo',
				'exp'   => $past_timestamp,
				'iat'   => ( $past_timestamp - 3600 ),
				'scope' => 'ai-generation',
			]
		);
		$encoded_payload = \base64_encode( $payload );

		$jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{$encoded_payload}.signature_hash_here";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertTrue( $result );
	}

	/**
	 * Tests has_token_expired with a realistic JWT structure but not expired.
	 *
	 * @return void
	 */
	public function test_has_token_expired_realistic_valid_jwt() {
		// Create a more realistic payload structure.
		$future_timestamp = ( \time() + 1800 ); // 30 minutes from now.
		$payload          = \json_encode(
			[
				'iss'   => 'yoast-ai-service',
				'sub'   => '123',
				'aud'   => 'wordpress-seo',
				'exp'   => $future_timestamp,
				'iat'   => \time(),
				'scope' => 'ai-generation',
			]
		);
		$encoded_payload  = \base64_encode( $payload );

		$jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{$encoded_payload}.signature_hash_here";

		$result = $this->instance->has_token_expired( $jwt );

		$this->assertFalse( $result );
	}
}
