<?php

namespace Yoast\WP\Free\Tests\Inc;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class WPSEO_Health_Check_Curl_Version_Test extends TestCase {

	/**
	 * @var Mockery\Mock|\WPSEO_Health_Check_Curl_Version
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( \WPSEO_Health_Check_Curl_Version::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the run method returns early when cURL is not installed.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 */
	public function test_run_with_no_curl() {
		$this->instance
			->expects( 'get_curl_version' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label is empty because the health check test didn't run.
		$this->assertAttributeEquals( '', 'label', $this->instance );
	}

	/**
	 * Tests the run method returns early when no premium plugins are installed.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 */
	public function test_run_with_no_premium_plugins() {
		$this->instance
			->expects( 'get_curl_version' )
			->once()
			->andReturn( '' );

		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label is empty because the health check test didn't run.
		$this->assertAttributeEquals( '', 'label', $this->instance );
	}

	/**
	 * Tests the run method returns early when the MyYoast API is reachable.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 */
	public function test_run_with_myyoast_api_reachable() {
		$this->instance
			->expects( 'get_curl_version' )
			->once()
			->andReturn( '' );

		$this->instance
			->expects( 'has_premium_plugins_installed')
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->once()
			->andReturnTrue();

		$this->instance->run();

		// We just want to verify that the label is empty because the health check test didn't run.
		$this->assertAttributeEquals( '', 'label', $this->instance );
	}

	/**
	 * Tests the run method when the cURL version is up-to-date.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 * @covers WPSEO_Health_Check_Curl_Version::is_recent_curl_version
	 */
	public function test_run_with_updated_curl_version() {
		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		$this->instance
			->expects( 'get_curl_version' )
			->twice()
			->andReturn( '7.60.0' ); // > 7.20.0

		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'Your cURL PHP module is up-to-date', 'label', $this->instance );
	}

	/**
	 * Tests the run method when the cURL version is outdated.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 * @covers WPSEO_Health_Check_Curl_Version::is_recent_curl_version
	 */
	public function test_run_with_outdated_curl_version() {
		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		$this->instance
			->expects( 'get_curl_version' )
			->twice()
			->andReturn( '7.10.0' ); // < 7.20.0

		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'Your cURL PHP module is outdated', 'label', $this->instance );
	}

}
