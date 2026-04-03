<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Domain\Registered_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Client class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client
 */
final class MyYoast_Client_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Client
	 */
	private $instance;

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );

		$this->instance = new MyYoast_Client(
			$this->client_registration,
		);
	}

	/**
	 * Tests that is_registered delegates to client_registration.
	 *
	 * @covers ::is_registered
	 *
	 * @return void
	 */
	public function test_is_registered() {
		$this->client_registration
			->expects( 'is_registered' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->is_registered() );
	}

	/**
	 * Tests that ensure_registered delegates to client_registration.
	 *
	 * @covers ::ensure_registered
	 *
	 * @return void
	 */
	public function test_ensure_registered_delegates() {
		$registered = new Registered_Client( 'cid', 'rat', 'https://my.yoast.com/reg/cid' );

		$this->client_registration
			->expects( 'ensure_registered' )
			->once()
			->andReturn( $registered );

		$result = $this->instance->ensure_registered();

		$this->assertSame( 'cid', $result->get_client_id() );
	}
}
