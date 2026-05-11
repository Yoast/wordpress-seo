<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Infrastructure\Encoding;

use Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Base64url utility class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Infrastructure\Encoding\Base64url
 */
final class Base64url_Test extends TestCase {

	/**
	 * Tests that encode and decode round-trip correctly.
	 *
	 * @covers ::encode
	 * @covers ::decode
	 *
	 * @return void
	 */
	public function test_round_trip() {
		$data = \random_bytes( 32 );

		$encoded = Base64url::encode( $data );
		$decoded = Base64url::decode( $encoded );

		$this->assertSame( $data, $decoded );
	}

	/**
	 * Tests that encode produces URL-safe output without padding.
	 *
	 * @covers ::encode
	 *
	 * @return void
	 */
	public function test_encode_is_url_safe() {
		$data = \random_bytes( 32 );

		$encoded = Base64url::encode( $data );

		$this->assertStringNotContainsString( '+', $encoded );
		$this->assertStringNotContainsString( '/', $encoded );
		$this->assertStringNotContainsString( '=', $encoded );
	}

	/**
	 * Tests encoding a known value.
	 *
	 * @covers ::encode
	 *
	 * @return void
	 */
	public function test_encode_known_value() {
		// "Hello" in base64 is "SGVsbG8=", in base64url is "SGVsbG8".
		$this->assertSame( 'SGVsbG8', Base64url::encode( 'Hello' ) );
	}

	/**
	 * Tests decoding a known value.
	 *
	 * @covers ::decode
	 *
	 * @return void
	 */
	public function test_decode_known_value() {
		$this->assertSame( 'Hello', Base64url::decode( 'SGVsbG8' ) );
	}

	/**
	 * Tests that decode handles padding restoration.
	 *
	 * @covers ::decode
	 *
	 * @return void
	 */
	public function test_decode_handles_padding() {
		// Encode data that would normally require padding.
		$data    = 'AB';
		$encoded = Base64url::encode( $data );
		$decoded = Base64url::decode( $encoded );

		$this->assertSame( $data, $decoded );
	}
}
