<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Webmaster;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Bing_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Bing_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Webmaster\Bing_Presenter
 *
 * @group presenters
 * @group webmaster
 */
class Bing_Presenter_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Bing_Presenter
	 */
	protected $instance;

	/**
	 * The option key used in the presenter.
	 *
	 * @var string
	 */
	private $option_name = 'msverify';

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

		$this->instance = new Bing_Presenter();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance->helpers = (object) [
			'options' => $this->options,
		];
	}

	/**
	 * Tests the presentation for a Bing site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'bing-ver' );

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$this->assertSame(
			'<meta name="msvalidate.01" content="bing-ver" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests empty presentation.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_empty_present() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Bing site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'bing-ver' );

		$this->assertSame(
			'bing-ver',
			$this->instance->get()
		);
	}

	/**
	 * Tests the presentation for a Bing site verification string when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_with_class() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'bing-ver' );

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$this->assertSame(
			'<meta name="msvalidate.01" content="bing-ver" class="yoast-seo-meta-tag" />',
			$this->instance->present()
		);
	}
}
