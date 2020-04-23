<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters\Admin
 */

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_Warning_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter
 *
 * @group presenters
 */
class Migration_Error_Presenter_Test extends TestCase {

	/**
	 * Tests the present method.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( 'https://yoa.st/3-6' );

		$expected  = '<div class="notice notice-error">';
		$expected .= '<p>Yoast SEO was unable to create the database tables required and as such will not function correctly.</p>';
		$expected .= '<p>Please read <a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/3-6' ) . '">this help article</a> to find out how to resolve this problem.</p>';
		$expected .= '</div>';

		$instance = new Migration_Error_Presenter();

		$this->assertSame( $expected, $instance->present() );

	}
}
