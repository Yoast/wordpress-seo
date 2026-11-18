<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Mockery;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_List_Item_Presenter_Test
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexing_List_Item_Presenter
 */
final class Indexing_List_Item_Presenter_Test extends TestCase {

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );
	}

	/**
	 * Tests the present method.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present() {
		$this->short_link_helper
			->expects( 'get' )
			->with( 'https://yoa.st/3-z' )
			->andReturn( 'https://yoa.st/3-z?some-query-arg=some-value' );

		$instance = new Indexing_List_Item_Presenter( $this->short_link_helper );

		$expected = '<li><strong>Optimize SEO Data</strong><br/>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. If you have a lot of content it might take a while, but trust us, it\'s worth it. <a href="https://yoa.st/3-z?some-query-arg=some-value" target="_blank">Learn more about the benefits of optimized SEO data.</a><div id="yoast-seo-indexing-action" style="margin: 16px 0;"></div></li>';
		$actual   = $instance->present();

		$this->assertSame( $expected, $actual );
	}
}
