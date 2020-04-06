<?php

namespace Yoast\WP\SEO\Tests\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Yandex_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Yandex_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Webmaster\Yandex_Presenter
 *
 * @group presenters
 * @group webmaster
 */
class Yandex_Presenter_Test extends TestCase {

	/**
	 * @var Yandex_Presenter
	 */
	protected $instance;

	/**
	 * The option key used in the presenter.
	 *
	 * @var string
	 */
	private $option_name = 'yandexverify';

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Yandex_Presenter();

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'yandex-ver' );

		$this->instance->helpers = (object) [
			'options' => $options,
		];
	}

	/**
	 * Tests the presentation for a Yandex site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->assertSame(
			'<meta name="yandex-verification" content="yandex-ver" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Yandex site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->assertSame(
			'yandex-ver',
			$this->instance->get()
		);
	}
}
