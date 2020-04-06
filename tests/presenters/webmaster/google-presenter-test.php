<?php

namespace Yoast\WP\SEO\Tests\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Google_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Google_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Webmaster\Google_Presenter
 *
 * @group presenters
 * @group webmaster
 */
class Google_Presenter_Test extends TestCase {

	/**
	 * @var Google_Presenter
	 */
	protected $instance;

	/**
	 * The option key used in the presenter.
	 *
	 * @var string
	 */
	private $option_name = 'googleverify';

	/**
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Google_Presenter();

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'google-ver' );

		$this->instance->helpers = (object) [
			'options' => $options,
		];
	}

	/**
	 * Tests the presentation for a Google site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->assertSame(
			'<meta name="google-site-verification" content="google-ver" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Google site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->assertSame(
			'google-ver',
			$this->instance->get()
		);
	}
}
