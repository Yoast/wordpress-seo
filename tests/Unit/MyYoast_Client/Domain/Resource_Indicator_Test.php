<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Domain;

use Yoast\WP\SEO\MyYoast_Client\Domain\Exceptions\Invalid_Resource_Exception;
use Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Resource_Indicator value object.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Domain\Resource_Indicator
 */
final class Resource_Indicator_Test extends TestCase {

	/**
	 * Tests that an absolute URI is accepted.
	 *
	 * @covers ::__construct
	 * @covers ::value
	 *
	 * @return void
	 */
	public function test_construct_accepts_absolute_uri() {
		$this->assertSame( 'https://ai.yoa.st', ( new Resource_Indicator( 'https://ai.yoa.st' ) )->value() );
		$this->assertSame( 'https://api.example.com/v2', ( new Resource_Indicator( 'https://api.example.com/v2' ) )->value() );
	}

	/**
	 * Tests that absolute URIs with non-URL schemes (urn, did) are accepted.
	 *
	 * RFC 8707 does not restrict the scheme; the AS decides what to accept via invalid_target.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_accepts_non_url_absolute_uri() {
		$this->assertSame( 'urn:example:resource', ( new Resource_Indicator( 'urn:example:resource' ) )->value() );
		$this->assertSame( 'did:web:example.com', ( new Resource_Indicator( 'did:web:example.com' ) )->value() );
	}

	/**
	 * Tests that a trailing root slash is trimmed for storage-key stability.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_trims_root_trailing_slash() {
		$this->assertSame( 'https://ai.yoa.st', ( new Resource_Indicator( 'https://ai.yoa.st/' ) )->value() );
	}

	/**
	 * Tests that a non-root trailing slash is preserved.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_preserves_non_root_path_trailing_slash() {
		$this->assertSame( 'https://api.example.com/v2/', ( new Resource_Indicator( 'https://api.example.com/v2/' ) )->value() );
	}

	/**
	 * Tests that a fragment is rejected per RFC 8707 §2.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_rejects_fragment() {
		$this->expectException( Invalid_Resource_Exception::class );

		new Resource_Indicator( 'https://ai.yoa.st#frag' );
	}

	/**
	 * Tests that a relative URI is rejected.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_rejects_relative_uri() {
		$this->expectException( Invalid_Resource_Exception::class );

		new Resource_Indicator( '/api/v2' );
	}

	/**
	 * Tests that an invalid scheme syntax (RFC 3986 §3.1) is rejected.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_rejects_invalid_scheme_syntax() {
		$this->expectException( Invalid_Resource_Exception::class );

		new Resource_Indicator( '1https://example.com' );
	}

	/**
	 * Tests that a string with no scheme is rejected.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_rejects_string_without_scheme() {
		$this->expectException( Invalid_Resource_Exception::class );

		new Resource_Indicator( 'example.com/path' );
	}

	/**
	 * Tests that an empty string is rejected.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_rejects_empty_string() {
		$this->expectException( Invalid_Resource_Exception::class );

		new Resource_Indicator( '' );
	}

	/**
	 * Tests __toString.
	 *
	 * @covers ::__toString
	 *
	 * @return void
	 */
	public function test_to_string() {
		$indicator = new Resource_Indicator( 'https://ai.yoa.st' );

		$this->assertSame( 'https://ai.yoa.st', (string) $indicator );
	}

	/**
	 * Tests equals() identifies same canonical values.
	 *
	 * @covers ::equals
	 *
	 * @return void
	 */
	public function test_equals_returns_true_for_same_value() {
		$a = new Resource_Indicator( 'https://ai.yoa.st' );
		$b = new Resource_Indicator( 'https://ai.yoa.st/' );

		$this->assertTrue( $a->equals( $b ) );
	}

	/**
	 * Tests equals() distinguishes different canonical values.
	 *
	 * @covers ::equals
	 *
	 * @return void
	 */
	public function test_equals_returns_false_for_different_value() {
		$a = new Resource_Indicator( 'https://ai.yoa.st' );
		$b = new Resource_Indicator( 'https://my.yoast.com' );

		$this->assertFalse( $a->equals( $b ) );
	}
}
