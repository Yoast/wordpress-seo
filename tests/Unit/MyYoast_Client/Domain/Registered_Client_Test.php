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
	 *
	 * @return void
	 */
	public function test_getters() {
		$dto = new Registered_Client(
			'client-123',
			'rat-456',
			'https://my.yoast.com/api/oauth/reg/client-123',
			[ 'software_statement' => 'jwt-here' ],
		);

		$this->assertSame( 'client-123', $dto->get_client_id() );
		$this->assertSame( 'rat-456', $dto->get_registration_access_token() );
		$this->assertSame( 'https://my.yoast.com/api/oauth/reg/client-123', $dto->get_registration_client_uri() );
		$this->assertSame( [ 'software_statement' => 'jwt-here' ], $dto->get_metadata() );
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
		$dto   = new Registered_Client( 'cid', 'rat', 'https://example.com/reg/cid', [ 'key' => 'val' ] );
		$array = $dto->to_array();

		$this->assertSame( 'cid', $array['client_id'] );
		$this->assertSame( 'rat', $array['registration_access_token'] );
		$this->assertSame( 'https://example.com/reg/cid', $array['registration_client_uri'] );
		$this->assertSame( [ 'key' => 'val' ], $array['metadata'] );
	}

	/**
	 * Tests that default metadata is an empty array.
	 *
	 * @covers ::__construct
	 * @covers ::get_metadata
	 *
	 * @return void
	 */
	public function test_default_metadata() {
		$dto = new Registered_Client( 'cid', 'rat', 'https://example.com/reg/cid' );

		$this->assertSame( [], $dto->get_metadata() );
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
