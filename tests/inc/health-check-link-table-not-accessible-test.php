<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Health_Check_Link_Table_Not_Accessible;
use Yoast\WP\SEO\Tests\TestCase;

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
	public function setUp() {
		parent::setUp();

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
		$this->assertAttributeEquals( '', 'label', $this->instance );
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

		$this->instance
			->expects( 'are_tables_accessible' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'The text link counter is working as expected', 'label', $this->instance );
		// We want to verify that the status attribute is "good".
		$this->assertAttributeEquals( 'good', 'status', $this->instance );
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

		$this->instance
			->expects( 'are_tables_accessible' )
			->once()
			->andReturnFalse();

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'The text link counter feature is not working as expected', 'label', $this->instance );
		// We want to verify that the status attribute is "recommended".
		$this->assertAttributeEquals( 'recommended', 'status', $this->instance );
	}
}
