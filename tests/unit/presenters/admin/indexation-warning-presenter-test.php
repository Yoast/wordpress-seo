<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexation_Warning_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_Warning_Presenter
 *
 * @group presenters
 * @group indexation
 */
class Indexation_Warning_Presenter_Test extends TestCase {

	/**
	 * Holds the options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		Monkey\Functions\expect( 'wp_create_nonce' )
			->with( 'wpseo-ignore' )
			->andReturn( 123456789 );

		Monkey\Functions\expect( 'add_query_arg' )
			->andReturn( '' );

		$this->options = Mockery::mock( Options_Helper::class );
		$this->options->expects( 'get' )->with( 'indexation_started', 0 )->andReturn( 0 );

		parent::setUp();
	}

	/**
	 * Tests the presenter of the warning with run here action.
	 *
	 * @covers ::present
	 */
	public function test_present_run_here() {
		$presenter = new Indexation_Warning_Presenter( 12, $this->options, Indexation_Warning_Presenter::ACTION_TYPE_RUN_HERE );

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
	 * Tests the presenter of the warning with link to action.
	 *
	 * @covers ::present
	 */
	public function test_present_link_to() {
		Monkey\Functions\expect( 'admin_url' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_tools' );

		Monkey\Functions\expect( 'wp_nonce_url' )
			->with( '\'https://example.com/wp-admin/admin.php?page=wpseo_tools&yoast_seo_hide=indexation_warning\'' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_tools&yoast_seo_hide=indexation_warning&wp_nonce=123456' );
		Monkey\Functions\expect( 'add_query_arg' )
			->with( 'yoast_seo_hide', 'indexation_warning' )
			->andReturn( 'https://example.com/wp-admin/admin.php?page=wpseo_tools&yoast_seo_hide=indexation_warning' );

		$presenter = new Indexation_Warning_Presenter( 12, $this->options, Indexation_Warning_Presenter::ACTION_TYPE_LINK_TO );

		$expected  = '<div id="yoast-indexation-warning" class="notice notice-success"><p>';
		$expected .= '<a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site.</a></p>';
		$expected .= '<p>To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<a class="button" href="https://example.com/wp-admin/admin.php?page=wpseo_tools">Start processing and speed up your site now</a>';
		$expected .= '<hr /><p><a href="https://example.com/wp-admin/admin.php?page=wpseo_tools&yoast_seo_hide=indexation_warning&wp_nonce=123456" class="button-link">Hide this notice</a> ';
		$expected .= '(everything will continue to function normally)</p></div>';

		$this->assertEquals( $expected, $presenter->present() );
	}
}
