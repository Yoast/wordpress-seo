<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Exception;
use Mockery;
use Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Client_Registration_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\Token_Storage_Interface;
use Yoast\WP\SEO\MyYoast_Client\Application\Ports\User_Token_Storage_Interface;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the MyYoast_Client_Cleanup class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\MyYoast_Client_Cleanup
 */
final class MyYoast_Client_Cleanup_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var MyYoast_Client_Cleanup
	 */
	private $instance;

	/**
	 * The client registration mock.
	 *
	 * @var Client_Registration_Interface|Mockery\MockInterface
	 */
	private $client_registration;

	/**
	 * The site-level token storage mock.
	 *
	 * @var Token_Storage_Interface|Mockery\MockInterface
	 */
	private $token_storage;

	/**
	 * The user-level token storage mock.
	 *
	 * @var User_Token_Storage_Interface|Mockery\MockInterface
	 */
	private $user_token_storage;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_registration = Mockery::mock( Client_Registration_Interface::class );
		$this->token_storage       = Mockery::mock( Token_Storage_Interface::class );
		$this->user_token_storage  = Mockery::mock( User_Token_Storage_Interface::class );

		$this->instance = new MyYoast_Client_Cleanup(
			$this->client_registration,
			$this->token_storage,
			$this->user_token_storage,
		);
	}

	/**
	 * Tests that execute deregisters, deletes all tokens, and deletes local data.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_cleans_up_everything() {
		$this->client_registration
			->expects( 'deregister' )
			->once()
			->andReturn( true );

		$this->user_token_storage
			->expects( 'delete_all' )
			->once();

		$this->token_storage
			->expects( 'delete' )
			->once();

		$this->client_registration
			->expects( 'delete_local_data' )
			->once();

		$this->instance->execute();
	}

	/**
	 * Tests that execute continues cleanup when deregistration throws.
	 *
	 * @covers ::execute
	 *
	 * @return void
	 */
	public function test_execute_continues_when_deregister_fails() {
		$this->client_registration
			->expects( 'deregister' )
			->once()
			->andThrow( new Exception( 'Network error' ) );

		$this->user_token_storage
			->expects( 'delete_all' )
			->once();

		$this->token_storage
			->expects( 'delete' )
			->once();

		$this->client_registration
			->expects( 'delete_local_data' )
			->once();

		$this->instance->execute();
	}
}
