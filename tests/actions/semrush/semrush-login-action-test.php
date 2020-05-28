<?php

namespace Yoast\WP\SEO\Tests\Actions\SEMrush;

use Mockery;
use Yoast\WP\SEO\Actions\SEMrush\SEMrush_Login_Action;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class SEMrush_Login_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\SEMrush\SEMrush_Login_Action
 */
class SEMrush_Login_Action_Test extends TestCase {

	/**
	 * @var SEMrush_Login_Action
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new SEMrush_Login_Action();
	}

	/**
	 * Tests getting a valid SEMrush client instance.
	 *
	 * @covers ::get_client
	 */
	public function test_valid_client_instance() {
		$client = Mockery::mock();
		$client->expects( 'get_client' )
			   ->once()
			   ->andReturn( new SEMrush_Client() );

		$this->assertInstanceOf( SEMrush_Client::class, $client );
	}

	/**
	 * Tests a valid authentication with SEMrush.
	 *
	 * @covers ::authenticate
	 */
	public function test_valid_authentication() {
		$client = Mockery::mock();
		$client->expects( 'get_client' )
			   ->once()
			   ->andReturn( new SEMrush_Client() );

		$this->assertEquals(
			(object) [
				'tokens'   => (object) [],
				'status' => 200,
			],
			$this->instance->authenticate( '123456' )
		);
	}

	/**
	 * Tests an invalid authentication with SEMrush.
	 *
	 * @covers ::authenticate
	 */
	public function test_invalid_invalid_authentication() {

	}
}
