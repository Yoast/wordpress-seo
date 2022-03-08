<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_MyYoast_Api_Request;
use Yoast\WP\SEO\Helpers\Curl_Helper;
use Yoast\WP\SEO\Services\Health_Check\MyYoast_API_Request_Factory;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Services\Health_Check\Curl_Runner;

/**
 * Curl_Runner
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Curl_Runner
 */
class Curl_Runner_Test extends TestCase {

	/**
	 * The Curl_Runner instance to be tested.
	 *
	 * @var Curl_Runner
	 */
	private $instance;

	/**
	 * A mocked add-on manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager_mock;

	/**
	 * A mocked MyYoast API request.
	 *
	 * @var WPSEO_MyYoast_Api_Request
	 */
	private $my_yoast_api_mock;

	/**
	 * A mocked cURL helper.
	 *
	 * @var Curl_Helper
	 */
	private $curl_helper_mock;

	/**
	 * A mocked MyYoast API request factory that returns a mocked MyYoast API request.
	 *
	 * @var MyYoast_API_Request_Factory
	 */
	private $my_yoast_api_request_factory_mock;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->my_yoast_api_mock                 = Mockery::mock( WPSEO_MyYoast_Api_Request::class );
		$this->addon_manager_mock                = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->curl_helper_mock                  = Mockery::mock( Curl_Helper::class );
		$this->my_yoast_api_request_factory_mock = Mockery::mock( MyYoast_API_Request_Factory::class );

		// Incorrectly detects direct calls to cURL.
		// phpcs:ignore WordPress.WP.AlternativeFunctions -- Reason: Incorrectly detects direct calls to cURL.
		$this->instance = new Curl_Runner(
			$this->addon_manager_mock,
			$this->my_yoast_api_request_factory_mock,
			$this->curl_helper_mock
		);
	}

	/**
	 * Checks if the health check correctly checks the minimum required cURL version.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::has_recent_curl_version_installed
	 * @covers ::can_reach_my_yoast_api
	 * @covers ::is_successful
	 * @covers ::check_has_installed_addons
	 * @covers ::check_curl_installed
	 * @covers ::check_curl_is_recent
	 * @covers ::check_can_reach_my_yoast_api
	 */
	public function test_curl_version_too_old() {
		$this->my_yoast_api_request_factory_mock
			->shouldReceive( 'create' )
			->andReturn( $this->my_yoast_api_mock );

		$this->my_yoast_api_mock
			->shouldReceive( 'fire' )
			->andReturn( false );

		$this->addon_manager_mock
			->shouldReceive( 'has_installed_addons' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'is_installed' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'get_version' )
			->andReturn( '7.33.0' );

		$this->instance->run();

		$this->assertFalse( $this->instance->has_recent_curl_version_installed() );
		$this->assertFalse( $this->instance->can_reach_my_yoast_api() );
		$this->assertFalse( $this->instance->is_successful() );
	}

	/**
	 * Checks if the health check quits early when there isn't any cURL version installed.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::has_recent_curl_version_installed
	 * @covers ::can_reach_my_yoast_api
	 * @covers ::is_successful
	 * @covers ::check_has_installed_addons
	 * @covers ::check_curl_installed
	 */
	public function test_curl_not_installed() {
		$this->addon_manager_mock
			->shouldReceive( 'has_installed_addons' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'is_installed' )
			->andReturn( false );

		$this->instance->run();

		$this->assertFalse( $this->instance->has_recent_curl_version_installed() );
		$this->assertFalse( $this->instance->can_reach_my_yoast_api() );
		$this->assertFalse( $this->instance->is_successful() );
	}

	/**
	 * Checks if the health check correctly detects when the MyYoast API isn't reachable.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::has_recent_curl_version_installed
	 * @covers ::can_reach_my_yoast_api
	 * @covers ::is_successful
	 * @covers ::check_has_installed_addons
	 * @covers ::check_curl_installed
	 */
	public function test_my_yoast_not_reachable() {
		$this->my_yoast_api_request_factory_mock
			->shouldReceive( 'create' )
			->andReturn( $this->my_yoast_api_mock );

		$this->my_yoast_api_mock
			->shouldReceive( 'fire' )
			->andReturn( false );

		$this->addon_manager_mock
			->shouldReceive( 'has_installed_addons' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'is_installed' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'get_version' )
			->andReturn( Curl_Runner::MINIMUM_CURL_VERSION );

		$this->instance->run();

		$this->assertTrue( $this->instance->has_recent_curl_version_installed() );
		$this->assertFalse( $this->instance->can_reach_my_yoast_api() );
		$this->assertFalse( $this->instance->is_successful() );
	}

	/**
	 * Checks if the health check correctly detects when the MyYoast API isn't reachable.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::has_recent_curl_version_installed
	 * @covers ::can_reach_my_yoast_api
	 * @covers ::is_successful
	 * @covers ::check_has_installed_addons
	 * @covers ::check_curl_installed
	 */
	public function test_is_successful() {
		$this->my_yoast_api_request_factory_mock
			->shouldReceive( 'create' )
			->andReturn( $this->my_yoast_api_mock );

		$this->my_yoast_api_mock
			->shouldReceive( 'fire' )
			->andReturn( true );

		$this->addon_manager_mock
			->shouldReceive( 'has_installed_addons' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'is_installed' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'get_version' )
			->andReturn( Curl_Runner::MINIMUM_CURL_VERSION );

		$this->instance->run();

		$this->assertTrue( $this->instance->has_recent_curl_version_installed() );
		$this->assertTrue( $this->instance->can_reach_my_yoast_api() );
		$this->assertTrue( $this->instance->is_successful() );
	}

	/**
	 * Checks if the health check correctly detects when there are premium plugins installed.
	 *
	 * @covers ::__construct
	 * @covers ::run
	 * @covers ::has_premium_plugins_installed
	 */
	public function test_detects_premium_plugins_installed() {
		$this->my_yoast_api_request_factory_mock
			->shouldReceive( 'create' )
			->andReturn( $this->my_yoast_api_mock );

		$this->my_yoast_api_mock
			->shouldReceive( 'fire' )
			->andReturn( true );

		$this->addon_manager_mock
			->shouldReceive( 'has_installed_addons' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'is_installed' )
			->andReturn( true );

		$this->curl_helper_mock
			->shouldReceive( 'get_version' )
			->andReturn( Curl_Runner::MINIMUM_CURL_VERSION );

		$this->instance->run();

		$this->assertTrue( $this->instance->has_premium_plugins_installed() );
	}
}
