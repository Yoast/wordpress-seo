<?php

namespace Yoast\WP\Free\Tests\Inc;

use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Health_Check_Ryte
 * @group health-check
 */
class WPSEO_Health_Check_Ryte_Test extends TestCase {

	/**
	 * Tests the run method when Ryte integration is disabled.
	 *
	 * @covers ::run
	 */
	public function test_run_with_option_disabled() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'ryte_indexability' )
			->andReturn( '0' );

		$health_check = new \WPSEO_Health_Check_Ryte();
		$health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertAttributeEquals( '', 'label', $health_check );
	}

	/**
	 * Tests the run method when the site is not public.
	 *
	 * @covers ::run
	 */
	public function test_run_with_blog_not_public() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$health_check = new \WPSEO_Health_Check_Ryte();
		$health_check->run();

		// We just want to verify that the label attribute hasn't been set.
		$this->assertAttributeEquals( '', 'label', $health_check );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site cannot be indexed.
	 *
	 * @covers ::run
	 * @covers ::is_not_indexable_response
	 */
	public function test_run_site_cannot_be_indexed() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'ryte_indexability' )
			->andReturn( '1' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

//		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );

		// 'esc_url' : wp-admin/options-reading.php
		// 'esc_url' : https://kb.yoast.com/kb/your-site-isnt-indexable/
		// * button ( 'esc_atrr' ) : http://one.wordpress.test/wp-admin/site-health.php?wpseo-redo-ryte=1
		// * link to ryte site ( 'esc_url' ) : https://yoa.st/rytelp?php_version=7.2&platform=wordpress&platform_version=5.3.2&software=free&software_version=12.7.1&days_active=30plus&user_language=en_US

		$health_check = new \WPSEO_Health_Check_Ryte();
		$health_check->run();

		// We just want to verify that the label attributes has been set.
		$this->assertAttributeEquals( 'Your site cannot be found by search engines', 'label', $health_check );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and it can't tell if it can be indexed.
	 *
	 * @covers ::run
	 * @covers ::unknown_indexability_response
	 */
	public function test_run_unknown_indexability() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'ryte_indexability' )
			->andReturn( '1' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$health_check = new \WPSEO_Health_Check_Ryte();
		$health_check->run();

		// 'esc_url' : https://kb.yoast.com/kb/indexability-check-doesnt-work/
		// * button ( 'esc_atrr' ) : http://one.wordpress.test/wp-admin/site-health.php?wpseo-redo-ryte=1
		// * link to ryte site ( 'esc_url' ) : https://yoa.st/rytelp?php_version=7.2&platform=wordpress&platform_version=5.3.2&software=free&software_version=12.7.1&days_active=30plus&user_language=en_US

		// We just want to verify that the label attributes has been set.
		$this->assertAttributeEquals( 'Ryte cannot determine whether your site can be found by search engines', 'label', $health_check );
	}

	/**
	 * Tests the run method when Ryte integration is enabled, the blog is public and the site can be indexed.
	 *
	 * @covers ::run
	 * @covers ::is_indexable_response
	 */
	public function test_run_site_can_be_indexed() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'ryte_indexability' )
			->andReturn( '1' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '1' );

		$health_check = new \WPSEO_Health_Check_Ryte();
		$health_check->run();

		// We just want to verify that the label attributes has been set.
		$this->assertAttributeEquals( 'Your site can be found by search engines', 'label', $health_check );
	}



}
