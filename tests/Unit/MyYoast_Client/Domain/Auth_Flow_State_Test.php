<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Domain;

use InvalidArgumentException;
use Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Flow_State;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Auth_Flow_State value object.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Domain\Auth_Flow_State
 */
final class Auth_Flow_State_Test extends TestCase {

	/**
	 * Tests the constructor and getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_code_verifier
	 * @covers ::get_state
	 * @covers ::get_nonce
	 * @covers ::get_redirect_uri
	 * @covers ::get_return_url
	 *
	 * @return void
	 */
	public function test_getters() {
		$state = new Auth_Flow_State( 'verifier', 'csrf-state', 'nonce-123', 'https://example.com/callback', 'https://example.com/settings' );

		$this->assertSame( 'verifier', $state->get_code_verifier() );
		$this->assertSame( 'csrf-state', $state->get_state() );
		$this->assertSame( 'nonce-123', $state->get_nonce() );
		$this->assertSame( 'https://example.com/callback', $state->get_redirect_uri() );
		$this->assertSame( 'https://example.com/settings', $state->get_return_url() );
	}

	/**
	 * Tests that return_url defaults to null.
	 *
	 * @covers ::__construct
	 * @covers ::get_return_url
	 *
	 * @return void
	 */
	public function test_return_url_defaults_to_null() {
		$state = new Auth_Flow_State( 'verifier', 'csrf-state', 'nonce', 'https://example.com/callback' );

		$this->assertNull( $state->get_return_url() );
	}

	/**
	 * Tests to_array and from_array round trip.
	 *
	 * @covers ::to_array
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_to_array_from_array_round_trip() {
		$original = new Auth_Flow_State( 'verifier', 'state', 'nonce', 'https://example.com/cb', 'https://example.com/return' );
		$restored = Auth_Flow_State::from_array( $original->to_array() );

		$this->assertSame( $original->get_code_verifier(), $restored->get_code_verifier() );
		$this->assertSame( $original->get_state(), $restored->get_state() );
		$this->assertSame( $original->get_nonce(), $restored->get_nonce() );
		$this->assertSame( $original->get_redirect_uri(), $restored->get_redirect_uri() );
		$this->assertSame( $original->get_return_url(), $restored->get_return_url() );
	}

	/**
	 * Tests to_array and from_array with null return_url.
	 *
	 * @covers ::to_array
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_to_array_from_array_without_return_url() {
		$original = new Auth_Flow_State( 'verifier', 'state', 'nonce', 'https://example.com/cb' );
		$restored = Auth_Flow_State::from_array( $original->to_array() );

		$this->assertNull( $restored->get_return_url() );
	}

	/**
	 * Tests that the constructor throws on empty code_verifier.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_code_verifier() {
		$this->expectException( InvalidArgumentException::class );

		new Auth_Flow_State( '', 'state', 'nonce', 'https://example.com/cb' );
	}

	/**
	 * Tests that the constructor throws on empty state.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_state() {
		$this->expectException( InvalidArgumentException::class );

		new Auth_Flow_State( 'verifier', '', 'nonce', 'https://example.com/cb' );
	}

	/**
	 * Tests that the constructor accepts null nonce (non-OIDC flow).
	 *
	 * @covers ::__construct
	 * @covers ::get_nonce
	 *
	 * @return void
	 */
	public function test_accepts_null_nonce() {
		$state = new Auth_Flow_State( 'verifier', 'state', null, 'https://example.com/cb' );

		$this->assertNull( $state->get_nonce() );
	}

	/**
	 * Tests to_array and from_array round trip with null nonce.
	 *
	 * @covers ::to_array
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_to_array_from_array_without_nonce() {
		$original = new Auth_Flow_State( 'verifier', 'state', null, 'https://example.com/cb' );
		$restored = Auth_Flow_State::from_array( $original->to_array() );

		$this->assertNull( $restored->get_nonce() );
	}

	/**
	 * Tests that the constructor throws on empty redirect_uri.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_throws_on_empty_redirect_uri() {
		$this->expectException( InvalidArgumentException::class );

		new Auth_Flow_State( 'verifier', 'state', 'nonce', '' );
	}

	/**
	 * Tests that from_array throws when required fields are missing.
	 *
	 * @covers ::from_array
	 *
	 * @return void
	 */
	public function test_from_array_throws_on_missing_fields() {
		$this->expectException( InvalidArgumentException::class );

		Auth_Flow_State::from_array( [] );
	}
}
