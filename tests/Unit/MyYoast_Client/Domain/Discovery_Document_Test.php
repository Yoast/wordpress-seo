<?php
namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Domain;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Discovery_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Server_Capability_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Discovery_Document class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Domain\Discovery_Document
 */
final class Discovery_Document_Test extends TestCase {

	/**
	 * A valid discovery response.
	 *
	 * @var array<string, string|string[]>
	 */
	private $valid_response;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->valid_response = [
			'issuer'                                           => 'https://my.yoast.com',
			'authorization_endpoint'                           => 'https://my.yoast.com/api/oauth/auth',
			'token_endpoint'                                   => 'https://my.yoast.com/api/oauth/token',
			'registration_endpoint'                            => 'https://my.yoast.com/api/oauth/reg',
			'revocation_endpoint'                              => 'https://my.yoast.com/api/oauth/token/revocation',
			'jwks_uri'                                         => 'https://my.yoast.com/api/oauth/jwks',
			'response_types_supported'                         => [ 'code' ],
			'subject_types_supported'                          => [ 'public' ],
			'id_token_signing_alg_values_supported'            => [ 'EdDSA' ],
			'code_challenge_methods_supported'                 => [ 'S256' ],
			'grant_types_supported'                            => [ 'authorization_code', 'refresh_token', 'client_credentials' ],
			'token_endpoint_auth_methods_supported'            => [ 'none', 'private_key_jwt' ],
			'token_endpoint_auth_signing_alg_values_supported' => [ 'EdDSA' ],
			'dpop_signing_alg_values_supported'                => [ 'EdDSA' ],
		];
	}

	/**
	 * Tests that construction succeeds with a valid response.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_creates_valid_document() {
		$document = new Discovery_Document( $this->valid_response );

		$this->assertInstanceOf( Discovery_Document::class, $document );
	}

	/**
	 * Tests all getter methods return correct values.
	 *
	 * @covers ::get_issuer
	 * @covers ::get_authorization_endpoint
	 * @covers ::get_token_endpoint
	 * @covers ::get_registration_endpoint
	 * @covers ::get_revocation_endpoint
	 * @covers ::get_jwks_uri
	 *
	 * @return void
	 */
	public function test_getters() {
		$document = new Discovery_Document( $this->valid_response );

		$this->assertSame( 'https://my.yoast.com', $document->get_issuer() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/auth', $document->get_authorization_endpoint() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/token', $document->get_token_endpoint() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/reg', $document->get_registration_endpoint() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/token/revocation', $document->get_revocation_endpoint() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/jwks', $document->get_jwks_uri() );
	}

	/**
	 * Tests that to_array returns the full discovery response.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$document = new Discovery_Document( $this->valid_response );

		$this->assertSame( $this->valid_response, $document->to_array() );
	}

	/**
	 * Tests round-trip: construct -> to_array -> construct preserves data.
	 *
	 * @covers ::__construct
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_round_trip() {
		$original   = new Discovery_Document( $this->valid_response );
		$serialized = $original->to_array();
		$restored   = new Discovery_Document( $serialized );

		$this->assertSame( $original->to_array(), $restored->to_array() );
	}

	/**
	 * Tests that construction throws when a spec-required field is missing.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_spec_required_field() {
		$config = $this->valid_response;
		unset( $config['token_endpoint'] );

		$this->expectException( Discovery_Failed_Exception::class );
		$this->expectExceptionMessage( 'token_endpoint' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when multiple spec-required fields are missing.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_multiple_missing_fields() {
		$config = $this->valid_response;
		unset( $config['token_endpoint'], $config['jwks_uri'] );

		$this->expectException( Discovery_Failed_Exception::class );
		$this->expectExceptionMessage( 'token_endpoint' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when a spec-required field has an empty value.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_empty_spec_required_field() {
		$config                           = $this->valid_response;
		$config['authorization_endpoint'] = '';

		$this->expectException( Discovery_Failed_Exception::class );
		$this->expectExceptionMessage( 'authorization_endpoint' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws without registration_endpoint.
	 *
	 * RECOMMENDED per OIDC spec, but required by this client for DCR (RFC 7591).
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_registration_endpoint() {
		$config = $this->valid_response;
		unset( $config['registration_endpoint'] );

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'registration_endpoint' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws without revocation_endpoint.
	 *
	 * Defined by RFC 8414, not the OIDC spec. Required by this client for token revocation (RFC 7009).
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_revocation_endpoint() {
		$config = $this->valid_response;
		unset( $config['revocation_endpoint'] );

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'revocation_endpoint' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when S256 PKCE is not supported.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_pkce_support() {
		$config                                     = $this->valid_response;
		$config['code_challenge_methods_supported'] = [ 'plain' ];

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'S256' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when DPoP EdDSA is not supported.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_dpop_support() {
		$config = $this->valid_response;
		unset( $config['dpop_signing_alg_values_supported'] );

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'DPoP' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when private_key_jwt is not supported.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_private_key_jwt() {
		$config = $this->valid_response;
		$config['token_endpoint_auth_methods_supported'] = [ 'none' ];

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'private_key_jwt' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction throws when authorization_code grant is not supported.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor_throws_on_missing_authorization_code_grant() {
		$config                          = $this->valid_response;
		$config['grant_types_supported'] = [ 'refresh_token', 'client_credentials' ];

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( 'authorization_code' );
		new Discovery_Document( $config );
	}

	/**
	 * Tests that construction rejects invalid types for spec-required string fields.
	 *
	 * @covers ::__construct
	 *
	 * @dataProvider data_invalid_string_field_values
	 *
	 * @param string $field The field name to set an invalid value on.
	 * @param mixed  $value The invalid value.
	 *
	 * @return void
	 */
	public function test_constructor_rejects_invalid_string_field( string $field, $value ) {
		$config           = $this->valid_response;
		$config[ $field ] = $value;

		$this->expectException( Discovery_Failed_Exception::class );
		$this->expectExceptionMessage( $field );
		new Discovery_Document( $config );
	}

	/**
	 * Data provider for invalid spec-required string field values.
	 *
	 * Each spec-required string field (issuer, authorization_endpoint, token_endpoint,
	 * jwks_uri) is tested against null, integer, boolean, array, and empty string values.
	 *
	 * @return array<string, array{string, mixed}> The test cases.
	 */
	public static function data_invalid_string_field_values(): array {
		$fields = [
			'issuer',
			'authorization_endpoint',
			'token_endpoint',
			'jwks_uri',
		];

		$invalid_values = [
			'null'         => null,
			'integer'      => 8,
			'float'        => 3.14,
			'boolean_true' => true,
			'array'        => [ 'https://example.com' ],
			'empty_string' => '',
		];

		$cases = [];
		foreach ( $fields as $field ) {
			foreach ( $invalid_values as $type => $value ) {
				$cases[ "{$field}_{$type}" ] = [ $field, $value ];
			}
		}

		return $cases;
	}

	/**
	 * Tests that construction rejects invalid types for spec-required array fields.
	 *
	 * @covers ::__construct
	 *
	 * @dataProvider data_invalid_array_field_values
	 *
	 * @param string $field The field name to set an invalid value on.
	 * @param mixed  $value The invalid value.
	 *
	 * @return void
	 */
	public function test_constructor_rejects_invalid_array_field( string $field, $value ) {
		$config           = $this->valid_response;
		$config[ $field ] = $value;

		$this->expectException( Discovery_Failed_Exception::class );
		$this->expectExceptionMessage( $field );
		new Discovery_Document( $config );
	}

	/**
	 * Data provider for invalid spec-required array field values.
	 *
	 * Each spec-required array field (response_types_supported, subject_types_supported,
	 * id_token_signing_alg_values_supported) is tested against null, string, integer,
	 * boolean, and empty array values.
	 *
	 * @return array<string, array{string, mixed}> The test cases.
	 */
	public static function data_invalid_array_field_values(): array {
		$fields = [
			'response_types_supported',
			'subject_types_supported',
			'id_token_signing_alg_values_supported',
		];

		$invalid_values = [
			'null'              => null,
			'string'            => 'code',
			'integer'           => 42,
			'boolean_true'      => true,
			'boolean_false'     => false,
			'empty_array'       => [],
			'array_with_null'   => [ null ],
			'array_with_int'    => [ 42 ],
			'array_with_bool'   => [ true ],
			'array_with_mixed'  => [ 'code', null, 8 ],
			'array_with_nested' => [ [ 'code' ] ],
		];

		$cases = [];
		foreach ( $fields as $field ) {
			foreach ( $invalid_values as $type => $value ) {
				$cases[ "{$field}_{$type}" ] = [ $field, $value ];
			}
		}

		return $cases;
	}

	/**
	 * Tests that construction rejects invalid types for client-required string fields.
	 *
	 * @covers ::__construct
	 *
	 * @dataProvider data_invalid_client_required_field_values
	 *
	 * @param string $field The field name to set an invalid value on.
	 * @param mixed  $value The invalid value.
	 *
	 * @return void
	 */
	public function test_constructor_rejects_invalid_client_required_field( string $field, $value ) {
		$config           = $this->valid_response;
		$config[ $field ] = $value;

		$this->expectException( Server_Capability_Exception::class );
		$this->expectExceptionMessage( $field );
		new Discovery_Document( $config );
	}

	/**
	 * Data provider for invalid client-required (but spec-optional) string field values.
	 *
	 * @return array<string, array{string, mixed}> The test cases.
	 */
	public static function data_invalid_client_required_field_values(): array {
		$fields = [
			'registration_endpoint',
			'revocation_endpoint',
		];

		$invalid_values = [
			'null'         => null,
			'integer'      => 8,
			'boolean_true' => true,
			'array'        => [ 'https://example.com' ],
			'empty_string' => '',
		];

		$cases = [];
		foreach ( $fields as $field ) {
			foreach ( $invalid_values as $type => $value ) {
				$cases[ "{$field}_{$type}" ] = [ $field, $value ];
			}
		}

		return $cases;
	}
}
