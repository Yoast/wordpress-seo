<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters\Admin
 */

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_Warning_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter
 *
 * @group presenters
 * @group indexation
 */
class Indexation_Warning_Presenter_Test extends TestCase {

	/**
	 * Tests the presenter of the warning.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		$presenter = new Indexation_Warning_Presenter();

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success"><p>';
		$expected .= '<strong>NEW:</strong> Yoast SEO can now store your site’s SEO data in a smarter way!<br/>';
		$expected .= 'Don\'t worry: this won\'t have to be done after each update.</p>';
		$expected .= '<button type="button" class="button yoast-open-indexation" data-title="Yoast indexation status">Click here to speed up your site now</button>';
		$expected .= '<p>Or <button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">hide this notice</button> ';
		$expected .= '(everything will continue to function as normal).</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}


}
