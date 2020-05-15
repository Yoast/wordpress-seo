<?php

namespace Yoast\WP\SEO\Tests\Inc;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class WPSEO_Health_Check_Page_Comments_Test extends TestCase {

	/**
	 * Tests the run method when page_comments are disabled.
	 *
	 * @covers WPSEO_Health_Check_Page_Comments::run
	 * @covers WPSEO_Health_Check_Page_Comments::has_page_comments
	 */
	public function test_run_with_option_disabled() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_comments' )
			->andReturn( '0' );

		$health_check = new \WPSEO_Health_Check_Page_Comments();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'Comments are displayed on a single page', 'label', $health_check );
	}

	/**
	 * Tests the run method when page_comments are enabled.
	 *
	 * @covers WPSEO_Health_Check_Page_Comments::run
	 * @covers WPSEO_Health_Check_Page_Comments::has_page_comments
	 */
	public function test_run_with_option_enabled() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_comments' )
			->andReturn( '1' );

		Monkey\Functions\expect( 'admin_url' )->andReturn( '' );

		$health_check = new \WPSEO_Health_Check_Page_Comments();
		$health_check->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'Comments break into multiple pages', 'label', $health_check );
	}
}
