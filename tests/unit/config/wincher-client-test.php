<?php

namespace Yoast\WP\SEO\Tests\Unit\Config;

use Mockery;
use Mockery\LegacyMockInterface;
use Mockery\MockInterface;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Config\Wincher_PKCE_Provider;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Remote_Handler;

/**
 * Class Wincher_Client_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\Wincher_Client
 */
class Wincher_Client_Test extends TestCase {

	/**
	 * The optins helper.
	 *
	 * @var LegacyMockInterface|MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * The test instance.
	 *
	 * @var Wincher_Client
	 */
	protected $instance;

	/**
	 * The current time value. This is stored so slow travis tests can't crash on differing timestamps.
	 *
	 * @var int
	 */
	protected $time;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn(
				[
					'access_token'  => '000000',
					'refresh_token' => '000001',
					'expires'       => ( $this->time + 604800 ),
					'has_expired'   => false,
					'created_at'    => 1234890,
				]
			);

		$instance = Mockery::mock(
			Wincher_Client::class,
			[
				$this->options_helper,
				Mockery::mock( WP_Remote_Handler::class ),
			]
		)->makePartial();

		$this->assertInstanceOf(
			Wincher_PKCE_Provider::class,
			$this->getPropertyValue( $instance, 'provider' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $instance, 'options_helper' )
		);
	}
}
