<?php
/**
 * WPSEO plugin test file.
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
	 * Tests the presentation of the warning.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		Monkey\Functions\expect( 'esc_js' )
			->with( '123456789' )
			->andReturnFirstArg();

		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		Monkey\Functions\expect( 'esc_attr__' )
			->with( 'Your content is being indexed', 'wordpress-seo' )
			->andReturnFirstArg();

		$presenter = new Indexation_Warning_Presenter();

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-warning"><p>';
		$expected .= '<strong>NEW:</strong> Yoast SEO can speed up your website! Please ';
		$expected .= '<button type="button" id="yoast-open-indexation" class="button-link" data-title="Your content is being indexed">click here</button> ';
		$expected .= 'to run our indexing process. Or <button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">';
		$expected .= 'dismiss this warning</button>.</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}


}
