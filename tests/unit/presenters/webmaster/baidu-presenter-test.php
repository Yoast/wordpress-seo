<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Webmaster;

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
	public function setUp() {
		parent::setUp();

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

		$this->assertSame(
			'<meta name="baidu-site-verification" content="baidu" />',
			$this->instance->present()
		);

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

		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->get()
		);
	}
}
