<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Google_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * Represents the instance to test.
	 *
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

		$this->instance = new Google_Presenter();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance->helpers = (object) [
			'options' => $this->options,
		];
	}

	/**
	 * Tests the presentation for a Google site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'google-ver' );

		$this->assertSame(
			'<meta name="google-site-verification" content="google-ver" />',
			$this->instance->present()
		);

		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Google site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'google-ver' );

		$this->assertSame(
			'google-ver',
			$this->instance->get()
		);
	}
}
