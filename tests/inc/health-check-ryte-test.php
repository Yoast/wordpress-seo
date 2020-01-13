<?php

namespace Yoast\WP\Free\Tests\Inc;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Health_Check_Ryte
 * @group health-check
 */
class WPSEO_Health_Check_Ryte_Test extends TestCase {

	/**
	 * @var \Mockery\Mock WPSEO_Ryte_Option
	 */
	private $ryte_option;

	/**
	 * @var \Mockery\Mock WPSEO_Health_Check_Ryte
	 */
	private $health_check;

	public function setUp() {
		parent::setUp();

		$this->ryte_option = Mockery::mock( \WPSEO_Ryte_Option::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->health_check = Mockery::mock( \WPSEO_Health_Check_Ryte::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->health_check
			->expects( 'get_ryte_option' )
			->once()
			->andReturn( $this->ryte_option );
	}

	/**
	 * Tests the run method when Ryte integration is disabled.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 */
	public function test_run_with_option_disabled() {
		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnFalse();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertAttributeEquals( '', 'label', $this->health_check );
	}

	/**
	 * Tests the run method when the site is not public.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 */
	public function test_run_with_blog_not_public() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$this->ryte_option
			->expects( 'is_enabled' )
			->once()
			->andReturnTrue();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertAttributeEquals( '', 'label', $this->health_check );
	}

	/**
	 * Tests the run method when the development mode is on, but Yoast development mode is not on.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 */
	public function test_run_with_development_mode() {
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
			->andReturnTrue();

		$this->health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertAttributeEquals( '', 'label', $this->health_check );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site cannot be indexed.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 * @covers WPSEO_Health_Check_Ryte::is_not_indexable_response
	 */
	public function test_run_site_cannot_be_indexed() {
		$this->ryte_enabled_and_blog_public();

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( \WPSEO_Ryte_Option::IS_NOT_INDEXABLE );

		$this->ryte_option
			->expects( 'should_be_fetched' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'admin_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->health_check->run();

		$this->assertAttributeEquals( 'Your site cannot be found by search engines', 'label', $this->health_check );
		$this->assertAttributeEquals( 'critical', 'status', $this->health_check  );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and and the Ryte Option cannot be fetched.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 * @covers WPSEO_Health_Check_Ryte::unknown_indexability_response
	 */
	public function test_run_cannot_fetch() {
		$this->ryte_enabled_and_blog_public();

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( \WPSEO_Ryte_Option::CANNOT_FETCH );

		$this->ryte_option
			->expects( 'should_be_fetched' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'admin_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->health_check->run();
		$this->assertAttributeEquals( 'Ryte cannot determine whether your site can be found by search engines', 'label', $this->health_check );
		$this->assertAttributeEquals( 'recommended', 'status', $this->health_check  );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the Ryte Option is not fetched.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 * @covers WPSEO_Health_Check_Ryte::unknown_indexability_response
	 */
	public function test_run_not_fetched() {
		$this->ryte_enabled_and_blog_public();

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( \WPSEO_Ryte_Option::NOT_FETCHED );

		$this->ryte_option
			->expects( 'should_be_fetched' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'admin_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->health_check->run();
		$this->assertAttributeEquals( 'Ryte cannot determine whether your site can be found by search engines', 'label', $this->health_check );
		$this->assertAttributeEquals( 'recommended', 'status', $this->health_check  );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site can be indexed.
	 *
	 * @covers WPSEO_Health_Check_Ryte::run
	 * @covers WPSEO_Health_Check_Ryte::is_indexable_response
	 */
	public function test_run_site_can_be_indexed() {
		$this->ryte_enabled_and_blog_public();

		$this->ryte_option
			->expects( 'get_status' )
			->once()
			->andReturn( \WPSEO_Ryte_Option::IS_INDEXABLE );

		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->health_check->run();
		$this->assertAttributeEquals( 'Your site can be found by search engines', 'label', $this->health_check );
		$this->assertAttributeEquals( 'good', 'status', $this->health_check  );

	}

	/**
	 * Mocks that the blog is public, Ryte is enabled and development mode is not on (or Yoast development mode is on).
	 *
	 * @throws Monkey\Expectation\Exception\ExpectationArgsRequired
	 */
	private function ryte_enabled_and_blog_public() {
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


}
