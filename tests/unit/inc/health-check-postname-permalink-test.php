<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use WPSEO_Health_Check_Postname_Permalink;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class Health_Check_Postname_Permalink_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();
	}

	/**
	 * Tests the run method when the permalink structure is set to "Post name".
	 *
	 * @covers WPSEO_Health_Check_Postname_Permalink::run
	 * @covers WPSEO_Health_Check_Postname_Permalink::has_postname_in_permalink
	 */
	public function test_run_with_postname_is_permalink() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%postname%/' );

		$health_check = new WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertEquals(
			'Your permalink structure includes the post name',
			$this->getPropertyValue( $health_check, 'label' )
		);
	}

	/**
	 * Tests the run method when the permalink structure is a custom one that includes '%postname%'.
	 *
	 * @covers WPSEO_Health_Check_Postname_Permalink::run
	 * @covers WPSEO_Health_Check_Postname_Permalink::has_postname_in_permalink
	 */
	public function test_run_with_postname_in_permalink() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '/%category%/%postname%/' );

		$health_check = new WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertEquals(
			'Your permalink structure includes the post name',
			$this->getPropertyValue( $health_check, 'label' )
		);
	}

	/**
	 * Tests the run method when the permalink structure is set to "Plain".
	 *
	 * @covers WPSEO_Health_Check_Postname_Permalink::run
	 * @covers WPSEO_Health_Check_Postname_Permalink::has_postname_in_permalink
	 */
	public function test_run_with_plain_permalink() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'permalink_structure' )
			->andReturn( '' );

		Monkey\Functions\expect( 'admin_url' )->andReturn( '' );

		$health_check = new WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertEquals(
			'You do not have your postname in the URL of your posts and pages',
			$this->getPropertyValue( $health_check, 'label' )
		);
	}
}
