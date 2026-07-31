<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Domain;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Registered_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client
 */
final class Registered_Client_Test extends TestCase {

	/**
	 * Tests the constructor and getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_client_id
	 * @covers ::get_registration_access_token
	 * @covers ::get_registration_client_uri
	 * @covers ::get_metadata
	 * @covers ::get_validated_uris
	 *
	 * @return void
	 */
	public function test_getters() {
		$dto = new Registered_Client(
			'client-123',
			'rat-456',
			'https://my.yoast.com/api/oauth/reg/client-123',
			[ 'software_statement' => 'jwt-here' ],
			[ 'https://example.com/callback' ],
		);

		$this->assertSame( 'client-123', $dto->get_client_id() );
		$this->assertSame( 'rat-456', $dto->get_registration_access_token() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/reg/client-123', $dto->get_registration_client_uri() );
		$this->assertSame( [ 'software_statement' => 'jwt-here' ], $dto->get_metadata() );
		$this->assertSame( [ 'https://example.com/callback' ], $dto->get_validated_uris() );
	}

	/**
	 * Tests the to_array method.
	 *
	 * @covers ::__construct
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array() {
		$dto   = new Registered_Client( 'cid', 'rat', 'https://example.com/reg/cid', [ 'key' => 'val' ], [ 'https://example.com/callback' ] );
		$array = $dto->to_array();

		$this->assertSame( 'cid', $array['client_id'] );
		$this->assertSame( 'rat', $array['registration_access_token'] );
		$this->assertSame( 'https://example.com/reg/cid', $array['registration_client_uri'] );
		$this->assertSame( [ 'key' => 'val' ], $array['metadata'] );
		$this->assertSame( [ 'https://example.com/callback' ], $array['validated_uris'] );
	}

	/**
	 * Tests that metadata and validated_uris default to empty arrays.
	 *
	 * @covers ::__construct
	 * @covers ::get_metadata
	 * @covers ::get_validated_uris
	 *
	 * @return void
	 */
	public function test_defaults() {
		$dto = new Registered_Client( 'cid', 'rat', 'https://example.com/reg/cid' );

		$this->assertSame( [], $dto->get_metadata() );
		$this->assertSame( [], $dto->get_validated_uris() );
	}

	/**
	 * Tests that get_redirect_uris returns the registered redirect URIs from metadata.
	 *
	 * @covers ::__construct
	 * @covers ::get_redirect_uris
	 *
	 * @return void
	 */
	public function test_get_redirect_uris() {
		$with_uris = new Registered_Client(
			'cid',
			'rat',
			'https://example.com/reg/cid',
			[ 'redirect_uris' => [ 'https://a.example/cb', 'https://b.example/cb' ] ],
		);
		$without   = new Registered_Client( 'cid', 'rat', 'https://example.com/reg/cid' );

		$this->assertSame( [ 'https://a.example/cb', 'https://b.example/cb' ], $with_uris->get_redirect_uris() );
		$this->assertSame( [], $without->get_redirect_uris() );
	}

	/**
	 * Tests that has_redirect_uris compares the registered set exactly (order-insensitive), so
	 * both additions and removals count as a mismatch.
	 *
	 * @covers ::__construct
	 * @covers ::has_redirect_uris
	 *
	 * @return void
	 */
	public function test_has_redirect_uris() {
		$client = new Registered_Client(
			'cid',
			'rat',
			'https://example.com/reg/cid',
			[ 'redirect_uris' => [ 'https://a.example/cb', 'https://b.example/cb' ] ],
		);

		// Same set, different order — match.
		$this->assertTrue( $client->has_redirect_uris( [ 'https://b.example/cb', 'https://a.example/cb' ] ) );

		// A removal — mismatch.
		$this->assertFalse( $client->has_redirect_uris( [ 'https://a.example/cb' ] ) );

		// An addition — mismatch.
		$this->assertFalse(
			$client->has_redirect_uris( [ 'https://a.example/cb', 'https://b.example/cb', 'https://c.example/cb' ] ),
		);
	}

	/**
	 * Tests that is_uri_validated reflects the stored validated URIs.
	 *
	 * @covers ::__construct
	 * @covers ::is_uri_validated
	 *
	 * @return void
	 */
	public function test_is_uri_validated() {
		$dto = new Registered_Client(
			'cid',
			'rat',
			'https://example.com/reg/cid',
			[],
			[ 'https://example.com/callback' ],
		);

		$this->assertTrue( $dto->is_uri_validated( 'https://example.com/callback' ) );
		$this->assertFalse( $dto->is_uri_validated( 'https://other.example/callback' ) );
	}

	/**
	 * Tests that with_validated_uris returns a copy with the URIs replaced, leaving the original intact.
	 *
	 * @covers ::__construct
	 * @covers ::with_validated_uris
	 * @covers ::get_validated_uris
	 *
	 * @return void
	 */
	public function test_with_validated_uris() {
		$dto = new Registered_Client(
			'cid',
			'rat',
			'https://example.com/reg/cid',
			[ 'key' => 'val' ],
			[ 'https://a.example/callback' ],
		);

		$copy = $dto->with_validated_uris( [ 'https://b.example/callback' ] );

		$this->assertNotSame( $dto, $copy );
		$this->assertSame( [ 'https://a.example/callback' ], $dto->get_validated_uris(), 'The original is unchanged.' );
		$this->assertSame( [ 'https://b.example/callback' ], $copy->get_validated_uris() );
		$this->assertSame( 'cid', $copy->get_client_id() );
		$this->assertSame( 'rat', $copy->get_registration_access_token() );
		$this->assertSame( 'https://example.com/reg/cid', $copy->get_registration_client_uri() );
		$this->assertSame( [ 'key' => 'val' ], $copy->get_metadata() );
	}

	/**
	 * Tests that the constructor throws when client_id is empty.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_client_id() {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'non-empty client_id' );

		new Registered_Client( '', 'rat', 'https://example.com/reg/cid' );
	}
}
