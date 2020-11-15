<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use WPSEO_Health_Check_Default_Tagline;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class Health_Check_Default_Tagline_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
	}

	/**
	 * Tests the run method when the WordPress tagline is the default one.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_default_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'Just another WordPress site' );

		Monkey\Functions\expect( 'wp_customize_url' )
			->once()
			->andReturn( 'http://example.org/wp-admin/customize.php' );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->andReturn( 'http://example.org/wp-admin/customize.php?autofocus[control]=blogdescription' );

		$health_check = new WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'You should change the default WordPress tagline', 'label', $health_check );
	}

	/**
	 * Tests the run method when the WordPress tagline is empty.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_empty_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( '' );

		$health_check = new WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'You changed the default WordPress tagline', 'label', $health_check );
	}

	/**
	 * Tests the run method when the WordPress tagline is a custom one.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_custom_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'My custom site tagline' );

		$health_check = new WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'You changed the default WordPress tagline', 'label', $health_check );
	}
}
