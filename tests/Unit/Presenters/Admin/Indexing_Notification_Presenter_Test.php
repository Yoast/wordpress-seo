<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexing_Notification_Presenter_Test
 *
 * @covers \Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexing_Notification_Presenter
 */
final class Indexing_Notification_Presenter_Test extends TestCase {

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
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
	 * Tests the present method when only a few notifications need
	 * to be indexed.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_few_indexables() {
		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$instance = new Indexing_Notification_Presenter(
			$this->short_link_helper,
			50,
			''
		);

		$expected = '<p>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. We estimate this will take less than a minute.</p><a class="button" href="https://example.org/wp-admin/admin.php?page=wpseo_tools">Start SEO data optimization</a>';
		$actual   = $instance->present();

		self::assertSame( $expected, $actual );
	}

	/**
	 * Tests the present method when only a few notifications need
	 * to be indexed.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_some_indexables() {
		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		$instance = new Indexing_Notification_Presenter(
			$this->short_link_helper,
			500,
			''
		);

		$expected = '<p>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. We estimate this will take a couple of minutes.</p><a class="button" href="https://example.org/wp-admin/admin.php?page=wpseo_tools">Start SEO data optimization</a>';
		$actual   = $instance->present();

		self::assertSame( $expected, $actual );
	}

	/**
	 * Tests the present method when only a few notifications need
	 * to be indexed.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_many_indexables() {
		$this->short_link_helper
			->expects( 'get' )
			->with( 'https://yoa.st/3-w' )
			->andReturn( 'https://yoa.st/3-w?some-query-arg=some-value' );

		Monkey\Functions\expect( 'get_admin_url' )
			->with( null, 'admin.php?page=wpseo_tools' )
			->andReturn( 'https://example.org/wp-admin/admin.php?page=wpseo_tools' );

		Monkey\Functions\expect( 'wp_create_nonce' )
			->andReturn( 'wp-nonce' );

		$instance = new Indexing_Notification_Presenter(
			$this->short_link_helper,
			4000,
			'A message to show in the notification.'
		);

		$expected = '<p>You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. We estimate this could take a long time, due to the size of your site. As an alternative to waiting, you could:<ul class="ul-disc"><li>Wait for a week or so, until Yoast SEO automatically processes most of your content in the background.</li><li><a href="https://yoa.st/3-w?some-query-arg=some-value" target="_blank">Run the indexation process on your server</a> using <a href="https://wp-cli.org/" target="_blank">WP CLI</a>.</li></ul></p><a class="button" href="https://example.org/wp-admin/admin.php?page=wpseo_tools">Start SEO data optimization</a>';
		$actual   = $instance->present();

		self::assertSame( $expected, $actual );
	}
}
