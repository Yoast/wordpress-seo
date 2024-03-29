<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Wincher;

use Mockery;
use Yoast\WP\SEO\Actions\Wincher\Wincher_Account_Action;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Account_Action_Test
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Wincher\Wincher_Account_Action
 */
final class Wincher_Account_Action_Test extends TestCase {

	/**
	 * The instance.
	 *
	 * @var Wincher_Account_Action
	 */
	protected $instance;

	/**
	 * The client instance.
	 *
	 * @var Mockery\MockInterface|Wincher_Client
	 */
	protected $client_instance;

	/**
	 * The options helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Set up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->client_instance = Mockery::mock( Wincher_Client::class );
		$this->options_helper  = Mockery::mock( Options_Helper::class );
		$this->instance        = new Wincher_Account_Action(
			$this->client_instance,
			$this->options_helper
		);
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Wincher_Client::class,
			$this->getPropertyValue( $this->instance, 'client' )
		);

		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
	}

	/**
	 * Tests that the user has a valid limit and can track.
	 *
	 * @covers ::check_limit
	 *
	 * @return void
	 */
	public function test_check_limit() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/beta/account' )
			->andReturn(
				[
					'limits' => [
						'keywords'     => [
							'usage' => 10,
							'limit' => 100,
						],
						'history_days' => 31,
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'canTrack'    => true,
				'limit'       => 100,
				'usage'       => 10,
				'status'      => 200,
				'historyDays' => 31,
			],
			$this->instance->check_limit()
		);
	}

	/**
	 * Tests that the user has an invalid limit and can't track.
	 *
	 * @covers ::check_limit
	 *
	 * @return void
	 */
	public function test_invalid_check_limit() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/beta/account' )
			->andReturn(
				[
					'limits' => [
						'keywords'     => [
							'usage' => 100,
							'limit' => 100,
						],
						'history_days' => 31,
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'canTrack'    => false,
				'limit'       => 100,
				'usage'       => 100,
				'status'      => 200,
				'historyDays' => 31,
			],
			$this->instance->check_limit()
		);
	}

	/**
	 * Tests that the user has no limit.
	 *
	 * @covers ::check_limit
	 *
	 * @return void
	 */
	public function test_unlimited_check_limit() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/beta/account' )
			->andReturn(
				[
					'limits' => [
						'keywords'     => [
							'usage' => 100000,
							'limit' => null,
						],
						'history_days' => 31,
					],
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'canTrack'    => true,
				'limit'       => null,
				'usage'       => 100000,
				'status'      => 200,
				'historyDays' => 31,
			],
			$this->instance->check_limit()
		);
	}

	/**
	 * Tests that an invalid campaign type is not supported.
	 *
	 * @covers ::get_upgrade_campaign
	 *
	 * @return void
	 */
	public function test_invalid_get_upgrade_campaign_type() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/v1/yoast/upgrade-campaign' )
			->andReturn(
				[
					'type'   => 'INVALID_TYPE',
					'value'  => 0.9,
					'months' => 10,
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'discount' => null,
				'months'   => null,
				'status'   => 200,
			],
			$this->instance->get_upgrade_campaign()
		);
	}

	/**
	 * Tests that campaign month value need to be more than 0.
	 *
	 * @covers ::get_upgrade_campaign
	 *
	 * @return void
	 */
	public function test_invalid_get_upgrade_campaign_months() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/v1/yoast/upgrade-campaign' )
			->andReturn(
				[
					'type'   => 'RATE',
					'value'  => 0.9,
					'months' => 0,
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'discount' => null,
				'months'   => null,
				'status'   => 200,
			],
			$this->instance->get_upgrade_campaign()
		);
	}

	/**
	 * Tests a valid get upgrade campaign.
	 *
	 * @covers ::get_upgrade_campaign
	 *
	 * @return void
	 */
	public function test_valid_get_upgrade_campaign() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/v1/yoast/upgrade-campaign' )
			->andReturn(
				[
					'type'   => 'RATE',
					'value'  => 0.9,
					'months' => 10,
					'status' => 200,
				]
			);

		$this->assertEquals(
			(object) [
				'discount' => 0.9,
				'months'   => 10,
				'status'   => 200,
			],
			$this->instance->get_upgrade_campaign()
		);
	}

	/**
	 * Tests empty get upgrade campaign.
	 *
	 * @covers ::get_upgrade_campaign
	 *
	 * @return void
	 */
	public function test_empty_get_upgrade_campaign() {
		$this->client_instance
			->expects( 'get' )
			->with( 'https://api.wincher.com/v1/yoast/upgrade-campaign' )
			->andReturn( [] );

		$this->assertEquals(
			(object) [
				'discount' => null,
				'months'   => null,
				'status'   => 200,
			],
			$this->instance->get_upgrade_campaign()
		);
	}
}
