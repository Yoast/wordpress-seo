<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Pinterest_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Pinterest_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Webmaster\Pinterest_Presenter
 *
 * @group presenters
 * @group webmaster
 */
class Pinterest_Presenter_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Pinterest_Presenter
	 */
	protected $instance;

	/**
	 * The option key used in the presenter.
	 *
	 * @var string
	 */
	private $option_name = 'pinterestverify';

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

		$this->instance = new Pinterest_Presenter();

		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance->helpers = (object) [
			'options' => $this->options,
		];
	}

	/**
	 * Tests the presentation for a Pinterest site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'pinterest-ver' );

		$this->assertSame(
			'<meta name="p:domain_verify" content="pinterest-ver" />',
			$this->instance->present()
		);

		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( '' );

		$this->assertSame(
			'',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Pinterest site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'pinterest-ver' );

		$this->assertSame(
			'pinterest-ver',
			$this->instance->get()
		);
	}
}
