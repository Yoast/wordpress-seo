<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Webmaster;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Baidu_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Baidu_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Webmaster\Baidu_Presenter
 *
 * @group presenters
 * @group webmaster
 */
class Baidu_Presenter_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Baidu_Presenter
	 */
	protected $instance;

	/**
	 * The option key used in the presenter.
	 *
	 * @var string
	 */
	private $option_name = 'baiduverify';

	/**
	 * Our mocked options helper.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Setup of the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->instance = new Baidu_Presenter();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance->helpers = (object) [
			'options' => $this->options,
		];
	}

	/**
	 * Tests the presentation for a Baidu site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'baidu' );

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->assertSame(
			'<meta name="baidu-site-verification" content="baidu" />',
			$this->instance->present()
		);
	}

	/**
	 * Test an empty presentation.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_empty_presentation() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Baidu site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'baidu' );

		$this->assertSame(
			'baidu',
			$this->instance->get()
		);
	}

	/**
	 * Test getting an empty value.
	 *
	 * @covers ::get
	 */
	public function test_get_empty() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->get()
		);
	}

	/**
	 * Tests the presentation for a Baidu site verification string when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_class() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'baidu' );

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertSame(
			'<meta name="baidu-site-verification" content="baidu" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
