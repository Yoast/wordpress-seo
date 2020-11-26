<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Health_Check_Link_Table_Not_Accessible;
use Yoast\WP\SEO\Config\Migration_Status;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class Health_Check_Link_Table_Not_Accessible_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Mockery\Mock|WPSEO_Health_Check_Link_Table_Not_Accessible
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance = Mockery::mock( WPSEO_Health_Check_Link_Table_Not_Accessible::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the run method returns early when the text link counter feature is not enabled.
	 *
	 * @covers WPSEO_Health_Check_Link_Table_Not_Accessible::run
	 */
	public function test_run_with_text_link_counter_feature_disabled() {
		$this->instance
			->expects( 'is_text_link_counter_enabled' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label is empty because the health check test didn't run.
		$this->assertEquals( '', $this->getPropertyValue( $this->instance, 'label' ) );
	}

	/**
	 * Tests the run method when the SEO links and SEO meta database tables exist.
	 *
	 * @covers WPSEO_Health_Check_Link_Table_Not_Accessible::run
	 */
	public function test_run_with_database_tables_accessible() {
		$this->instance
			->expects( 'is_text_link_counter_enabled' )
			->once()
			->andReturnTrue();

		$migration_status = Mockery::mock( Migration_Status::class );
		$migration_status->expects( 'is_version' )->once()->with( 'free', \WPSEO_VERSION )->andReturn( true );

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Migration_Status::class )->andReturn( $migration_status );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'classes' => $classes ] );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "passed" message.
		$this->assertEquals(
			'The text link counter is working as expected',
			$this->getPropertyValue( $this->instance, 'label' )
		);

		// We want to verify that the status attribute is "good".
		$this->assertEquals( 'good', $this->getPropertyValue( $this->instance, 'status' ) );
	}

	/**
	 * Tests the run method when the SEO links and SEO meta database tables do not exist.
	 *
	 * @covers WPSEO_Health_Check_Link_Table_Not_Accessible::run
	 */
	public function test_run_with_database_tables_not_accessible() {
		$this->instance
			->expects( 'is_text_link_counter_enabled' )
			->once()
			->andReturnTrue();

		$migration_status = Mockery::mock( Migration_Status::class );
		$migration_status->expects( 'is_version' )->once()->with( 'free', \WPSEO_VERSION )->andReturn( false );

		$classes = Mockery::mock();
		$classes->expects( 'get' )->once()->with( Migration_Status::class )->andReturn( $migration_status );

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'classes' => $classes ] );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "not passed" message.
		$this->assertEquals(
			'The text link counter feature is not working as expected',
			$this->getPropertyValue( $this->instance, 'label' )
		);

		// We want to verify that the status attribute is "recommended".
		$this->assertEquals( 'recommended', $this->getPropertyValue( $this->instance, 'status' ) );
	}
}
