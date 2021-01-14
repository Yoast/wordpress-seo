<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Health_Check_Ryte;
use WPSEO_Ryte_Option;
use WPSEO_Utils;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Health_Check_Ryte
 * @group health-check
 */
class Health_Check_Ryte_Test extends TestCase {

	/**
	 * Holds the ryte_option variable.
	 *
	 * @var Mockery\Mock|WPSEO_Ryte_Option
	 */
	private $ryte_option;

	/**
	 * Holds the health_check variable.
	 *
	 * @var Mockery\Mock|WPSEO_Health_Check_Ryte
	 */
	private $health_check;

	/**
	 * Set up the mock classes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->ryte_option = Mockery::mock( WPSEO_Ryte_Option::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->health_check = Mockery::mock( WPSEO_Health_Check_Ryte::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the run method when Ryte integration is disabled.
	 *
	 * @covers ::run
	 */
	public function test_run_with_option_disabled() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);

		$this->health_check
			->expects( 'get_ryte_option' )
			->once()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnFalse();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertEquals( '', $this->getPropertyValue( $this->health_check, 'label' ) );
	}

	/**
	 * Tests the run method when the site is not public.
	 *
	 * @covers ::run
	 */
	public function test_run_with_blog_not_public() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$this->health_check
			->expects( 'get_ryte_option' )
			->once()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnTrue();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertEquals( '', $this->getPropertyValue( $this->health_check, 'label' ) );
	}

	/**
	 * Tests the run method when the development mode is on, but Yoast development mode is not on.
	 *
	 * @covers ::run
	 */
	public function test_run_with_development_mode() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'production',
			]
		);

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$this->health_check
			->expects( 'get_ryte_option' )
			->once()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnTrue();

		$this->health_check
			->expects( 'is_development_mode' )
			->once()
			->andReturnTrue();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertEquals( '', $this->getPropertyValue( $this->health_check, 'label' ) );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site cannot be indexed.
	 *
	 * @covers ::run
	 * @covers ::is_not_indexable_response
	 */
	public function test_run_site_cannot_be_indexed() {
		$this->ryte_enabled_and_blog_public();

		Monkey\Functions\stubs(
			[
				'wp_remote_get'                    => null,
				'wp_remote_retrieve_response_code' => 200,
				'wp_remote_retrieve_body'          => WPSEO_Utils::format_json_encode( [] ),
				'wp_get_environment_type'          => 'production',
			]
		);

		$this->health_check
			->expects( 'get_ryte_option' )
			->twice()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( WPSEO_Ryte_Option::IS_NOT_INDEXABLE );

		Monkey\Functions\expect( 'wp_get_schedules' )->andReturn( [] );
		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->health_check->run();

		$this->assertEquals(
			'Your site cannot be found by search engines',
			$this->getPropertyValue( $this->health_check, 'label' )
		);
		$this->assertEquals( 'critical', $this->getPropertyValue( $this->health_check, 'status' ) );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and and the Ryte Option cannot be fetched.
	 *
	 * @covers ::run
	 * @covers ::unknown_indexability_response
	 */
	public function test_run_cannot_fetch() {
		$this->ryte_enabled_and_blog_public();

		Monkey\Functions\stubs(
			[
				'wp_remote_get'                    => null,
				'wp_remote_retrieve_response_code' => 200,
				'wp_remote_retrieve_body'          => null,
				'wp_get_environment_type'          => 'production',
			]
		);

		$this->health_check
			->expects( 'get_ryte_option' )
			->twice()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( WPSEO_Ryte_Option::CANNOT_FETCH );

		Monkey\Functions\expect( 'wp_get_schedules' )->andReturn( [] );
		Monkey\Functions\expect( 'update_option' )->andReturn( true );
		Monkey\Functions\expect( 'wp_remote_retrieve_response_message' )->andReturn( '' );
		Monkey\Functions\expect( 'wp_enqueue_style' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->health_check->run();
		$this->assertEquals(
			'Ryte cannot determine whether your site can be found by search engines',
			$this->getPropertyValue( $this->health_check, 'label' )
		);
		$this->assertEquals( 'recommended', $this->getPropertyValue( $this->health_check, 'status' ) );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site can be indexed.
	 *
	 * @covers ::run
	 * @covers ::is_indexable_response
	 */
	public function test_run_site_can_be_indexed() {
		$this->ryte_enabled_and_blog_public();

		Monkey\Functions\stubs(
			[
				'wp_remote_get'                    => null,
				'wp_remote_retrieve_response_code' => 200,
				'wp_remote_retrieve_body'          => WPSEO_Utils::format_json_encode( [] ),
				'wp_get_environment_type'          => 'production',
			]
		);

		$this->health_check
			->expects( 'get_ryte_option' )
			->twice()
			->andReturn( $this->ryte_option );

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( WPSEO_Ryte_Option::IS_INDEXABLE );

		Monkey\Functions\expect( 'wp_get_schedules' )->andReturn( [] );
		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->health_check->run();
		$this->assertEquals(
			'Your site can be found by search engines',
			$this->getPropertyValue( $this->health_check, 'label' )
		);
		$this->assertEquals( 'good', $this->getPropertyValue( $this->health_check, 'status' ) );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and and the Ryte response failed with errors.
	 *
	 * @covers ::run
	 * @covers ::response_error
	 */
	public function test_run_with_response_failure() {
		$this->ryte_enabled_and_blog_public();

		Monkey\Functions\stubs(
			[
				'wp_remote_get'                       => null,
				'wp_remote_retrieve_response_code'    => 500,
				'wp_remote_retrieve_body'             => null,
				'wp_remote_retrieve_response_message' => '',
				'wp_get_environment_type'             => 'production',
			]
		);

		$this->health_check
			->expects( 'get_ryte_option' )
			->once()
			->andReturn( $this->ryte_option );

		Monkey\Functions\expect( 'wp_get_schedules' )->andReturn( [] );
		Monkey\Functions\expect( 'update_option' )->andReturn( true );

		$this->health_check->run();
		$this->assertEquals(
			'An error occurred while checking whether your site can be found by search engines',
			$this->getPropertyValue( $this->health_check, 'label' )
		);
		$this->assertEquals( 'recommended', $this->getPropertyValue( $this->health_check, 'status' ) );
	}

	/**
	 * Mocks that the blog is public, Ryte is enabled and development mode is not on (or Yoast development mode is on).
	 *
	 * @throws Monkey\Expectation\Exception\ExpectationArgsRequired When args missing / wrong.
	 */
	private function ryte_enabled_and_blog_public() {
		$this->stubTranslationFunctions();

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnTrue();

		$this->health_check
			->expects( 'is_development_mode' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the site is indexable but the WordPress environment type is not "production".
	 *
	 * @covers ::run
	 * @covers ::response_error
	 */
	public function test_run_with_environment_type_not_production() {
		Monkey\Functions\stubs(
			[
				'wp_get_environment_type' => 'staging',
			]
		);

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertEquals( '', $this->getPropertyValue( $this->health_check, 'label' ) );
	}
}
