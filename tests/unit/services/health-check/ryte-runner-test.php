<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Health_Check;

use Mockery;
use WPSEO_Ryte;
use WPSEO_Ryte_Option;
use WPSEO_Utils;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Option_Factory;
use Yoast\WP\SEO\Services\Health_Check\Ryte_Runner;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Brain\Monkey;

/**
 * Ryte_Runner
 *
 * @coversDefaultClass Yoast\WP\SEO\Services\Health_Check\Ryte_Runner
 */
class Ryte_Runner_Test extends TestCase {

	/**
	 * The Ryte_Runner instance to be tested.
	 *
	 * @var Ryte_Runner
	 */
	private $instance;

	/**
	 * A mock for WPSEO_Ryte.
	 *
	 * @var WPSEO_Ryte
	 */
	private $ryte_mock;

	/**
	 * A mock for Ryte_Option_Factory that returns a WPSEO_Ryte_Option mock.
	 *
	 * @var Ryte_Option_Factory
	 */
	private $ryte_option_factory_mock;

	/**
	 * A mock for WPSEO_Ryte_Option.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	private $ryte_option_mock;

	/**
	 * A mock for WPSEO_Utils.
	 *
	 * @var WPSEO_Utils
	 */
	private $utils_mock;

	/**
	 * Set up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();

		$this->utils_mock               = Mockery::mock( WPSEO_Utils::class );
		$this->ryte_mock                = Mockery::mock( WPSEO_Ryte::class );
		$this->ryte_option_factory_mock = Mockery::mock( Ryte_Option_Factory::class );
		$this->ryte_option_mock         = Mockery::mock( WPSEO_Ryte_Option::class );

		$this->instance = new Ryte_Runner( $this->ryte_mock, $this->ryte_option_factory_mock, $this->utils_mock );
	}

	/**
	 * Checks if the health check cancels when the site is not in production.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 */
	public function test_doesnt_run_when_not_production() {
		Monkey\Functions\expect( 'wp_get_environment_type' )->andReturn( 'development' );
		$this->instance->run();

		$this->assertFalse( $this->instance->should_run() );
	}

	/**
	 * Checks if the health check cancels when the site is in development mode.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 */
	public function test_doesnt_run_when_in_development_mode() {
		Monkey\Functions\expect( 'wp_get_environment_type' )->andReturn( 'production' );
		Monkey\Functions\expect( 'wp_debug_mode' );
		$this->utils_mock->shouldReceive( 'is_development_mode' )->andReturn( true );
		$this->instance->run();

		$this->assertFalse( $this->instance->should_run() );
	}

	/**
	 * Checks if the health check cancels when the site is not public.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 */
	public function test_doesnt_run_when_not_public() {
		Monkey\Functions\expect( 'wp_get_environment_type' )->andReturn( 'production' );
		Monkey\Functions\expect( 'wp_debug_mode' );
		$this->utils_mock->shouldReceive( 'is_development_mode' )->andReturn( false );
		Monkey\Functions\expect( 'get_option' )->with( 'blog_public' )->andReturn( '0' );
		$this->instance->run();

		$this->assertFalse( $this->instance->should_run() );
	}

	/**
	 * Checks if the health check cancels if Ryte is disabled.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 */
	public function test_doesnt_run_when_ryte_is_disabled() {
		Monkey\Functions\expect( 'wp_get_environment_type' )->andReturn( 'production' );
		Monkey\Functions\expect( 'wp_debug_mode' );
		$this->utils_mock->shouldReceive( 'is_development_mode' )->andReturn( false );
		Monkey\Functions\expect( 'get_option' )->with( 'blog_public' )->andReturn( '1' );
		$this->ryte_option_factory_mock->shouldReceive( 'create' )->andReturn( $this->ryte_option_mock );
		$this->ryte_option_mock->shouldReceive( 'is_enabled' )->andReturn( false );
		$this->instance->run();

		$this->assertFalse( $this->instance->should_run() );
	}

	/**
	 * Checks if the health check will continue if the site is a production site and Ryte is enabled.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 */
	public function test_runs_when_production_and_ryte_is_enabled() {
		$this->set_production_with_ryte_enabled();

		$this->assertTrue( $this->instance->should_run() );
	}

	/**
	 * Checks if the health check has the right state when it wasn't able to fetch the indexability status from Ryte.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_could_not_fetch_state() {
		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once();
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::CANNOT_FETCH );

		$this->instance->run();

		$this->assertFalse( $this->instance->is_successful() );
		$this->assertTrue( $this->instance->has_unknown_indexability() );
		$this->assertFalse( $this->instance->got_response_error() );
		$this->assertNull( $this->instance->get_error_response() );
	}

	/**
	 * Checks if the health check has the right state when it wasn't able to fetch the indexability status from Ryte due to an error response.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_response_error_state() {
		$expected_response_error = [ 'is_error' => true ];

		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once()
			->andReturn( $expected_response_error );
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::CANNOT_FETCH );

		$this->instance->run();

		$actual_response_error = $this->instance->get_error_response();

		$this->assertFalse( $this->instance->is_successful() );
		$this->assertTrue( $this->instance->has_unknown_indexability() );
		$this->assertTrue( $this->instance->got_response_error() );
		$this->assertEquals( $expected_response_error, $actual_response_error );
	}

	/**
	 * Checks if the health check has the right state when Ryte reports that the site is indexable.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_successful_state() {
		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once();
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::IS_INDEXABLE );

		$this->instance->run();

		$this->assertTrue( $this->instance->is_successful() );
		$this->assertFalse( $this->instance->has_unknown_indexability() );
		$this->assertFalse( $this->instance->got_response_error() );
		$this->assertNull( $this->instance->get_error_response() );
	}

	/**
	 * Checks if the health check has the right state for when the indexability is unknown.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_unknown_indexability_state() {
		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once();
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::CANNOT_FETCH );

		$this->instance->run();

		$this->assertFalse( $this->instance->is_successful() );
		$this->assertTrue( $this->instance->has_unknown_indexability() );
		$this->assertFalse( $this->instance->got_response_error() );
		$this->assertNull( $this->instance->get_error_response() );
	}

	/**
	 * Checks if the health check has the right state for when the indexability is unknown because it wasn't fetched.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_unknown_indexability_not_fetched_state() {
		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once();
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::NOT_FETCHED );

		$this->instance->run();

		$this->assertFalse( $this->instance->is_successful() );
		$this->assertTrue( $this->instance->has_unknown_indexability() );
		$this->assertFalse( $this->instance->got_response_error() );
		$this->assertNull( $this->instance->get_error_response() );
	}

	/**
	 * Checks if the health check has the right state when Ryte reports that the site is not indexable.
	 *
	 * @return void
	 * @covers ::__construct
	 * @covers ::should_run
	 * @covers ::run
	 * @covers ::fetch_from_ryte
	 * @covers ::set_ryte_option
	 * @covers ::is_successful
	 * @covers ::has_unknown_indexability
	 * @covers ::could_fetch
	 * @covers ::got_response_error
	 * @covers ::get_error_response
	 */
	public function test_not_indexable_state() {
		$this->set_production_with_ryte_enabled();
		$this->ryte_mock
			->shouldReceive( 'fetch_from_ryte' )
			->once();
		$this->ryte_mock
			->shouldReceive( 'get_response' )
			->once();
		$this->ryte_option_mock
			->shouldReceive( 'get_status' )
			->andReturn( WPSEO_Ryte_Option::IS_NOT_INDEXABLE );

		$this->instance->run();

		$this->assertFalse( $this->instance->is_successful() );
		$this->assertFalse( $this->instance->has_unknown_indexability() );
		$this->assertFalse( $this->instance->got_response_error() );
		$this->assertNull( $this->instance->get_error_response() );
	}

	/**
	 * Sets the preconditions for the health check to run.
	 *
	 * @return void
	 */
	private function set_production_with_ryte_enabled() {
		Monkey\Functions\expect( 'wp_get_environment_type' )->andReturn( 'production' );
		Monkey\Functions\expect( 'wp_debug_mode' );
		$this->utils_mock->shouldReceive( 'is_development_mode' )->andReturn( false );
		Monkey\Functions\expect( 'get_option' )->with( 'blog_public' )->andReturn( '1' );
		$this->ryte_option_factory_mock->shouldReceive( 'create' )->andReturn( $this->ryte_option_mock );
		$this->ryte_option_mock->shouldReceive( 'is_enabled' )->andReturn( true );
	}
}
