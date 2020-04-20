<?php

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_Warning_Presenter_Test.
 *
 * @group presenters
 * @group admin
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter
 * @covers ::<!public>
 */
class Indexation_Warning_Presenter_Test extends TestCase {

	/**
	 * Tests the output.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$instance = new Indexation_Warning_Presenter();
		$expected = '<div id="yoast-indexation-warning" class="notice notice-warning"><p><strong>NEW:</strong> Yoast SEO can speed up your website! Please <button type="button" id="yoast-open-indexation" class="button-link" data-title="Your content is being indexed">click here</button> to run our indexing process. Or <button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="nonce">dismiss this warning</button>.</p></div>';

		Functions\expect( 'wp_create_nonce' )
			->once()
			->with( 'wpseo-ignore' )
			->andReturn( 'nonce' );

		$this->assertSame( $expected, $instance->present() );
	}
}
