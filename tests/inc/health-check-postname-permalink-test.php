<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class WPSEO_Health_Check_Postname_Permalink_Test extends TestCase {

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

		$health_check = new \WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'Your permalink structure includes the post name', 'label', $health_check );
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

		$health_check = new \WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'Your permalink structure includes the post name', 'label', $health_check );
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

		$health_check = new \WPSEO_Health_Check_Postname_Permalink();
		$health_check->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'You do not have your postname in the URL of your posts and pages', 'label', $health_check );
	}
}
