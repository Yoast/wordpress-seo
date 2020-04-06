<?php

namespace Yoast\WP\SEO\Tests\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Bing_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Bing_Presenter();

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'bing-ver' );

		$this->instance->helpers = (object) [
			'options' => $options,
		];
	}

	/**
	 * Tests the presentation for a Bing site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->assertSame(
			'<meta name="msvalidate.01" content="bing-ver" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Bing site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->assertSame(
			'bing-ver',
			$this->instance->get()
		);
	}
}
