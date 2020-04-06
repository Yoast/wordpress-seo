<?php

namespace Yoast\WP\SEO\Tests\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Baidu_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Baidu_Presenter();

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'baidu' );

		$this->instance->helpers = (object) [
			'options' => $options,
		];
	}

	/**
	 * Tests the presentation for a Baidu site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->assertEquals(
			'<meta name="baidu-site-verification" content="baidu" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Baidu site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->assertSame(
			'baidu',
			$this->instance->get()
		);
	}
}
