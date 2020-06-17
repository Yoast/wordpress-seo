<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters\Admin
 */

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
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
	public function test_present_button() {
		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( '' );

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( 'indexation_started', 0 )->andReturn( 0 );

		$presenter = new Indexation_Warning_Presenter( 12, false, $options );

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success"><p>';
		$expected .= '<a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site.</a></p>';
		$expected .= '<p>To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<button type="button" class="button yoast-open-indexation" data-title="<strong>Yoast indexing status</strong>" data-settings="yoastIndexationData">Start processing and speed up your site now</button>';
		$expected .= '<hr /><p><button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">Hide this notice</button> ';
		$expected .= '(everything will continue to function normally)</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}

	/**
	 * Tests the presenter of the warning.
	 *
	 * @covers ::present
	 */
	public function test_present_link() {
		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( '' );

		Monkey\Functions\expect( 'admin_url' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_tools' );

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( 'indexation_started', 0 )->andReturn( 0 );

		$presenter = new Indexation_Warning_Presenter( 12, true, $options );

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success"><p>';
		$expected .= '<a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site.</a></p>';
		$expected .= '<p>To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<a class="button" href="https://example.com/wp-admin/admin.php?page=wpseo_tools">Start processing and speed up your site now</a>';
		$expected .= '<hr /><p><button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="123456789">Hide this notice</button> ';
		$expected .= '(everything will continue to function normally)</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}
}
