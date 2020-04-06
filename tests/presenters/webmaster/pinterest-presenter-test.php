<?php

namespace Yoast\WP\SEO\Tests\Presenters\Webmaster;

use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Webmaster\Pinterest_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

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
	 * Setup of the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Pinterest_Presenter();

		$options = Mockery::mock( Options_Helper::class );
		$options->expects( 'get' )->with( $this->option_name, '' )->andReturn( 'pinterest-ver' );

		$this->instance->helpers = (object) [
			'options' => $options,
		];
	}

	/**
	 * Tests the presentation for a Pinterest site verification string.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$this->assertSame(
			'<meta name="p:domain_verify" content="pinterest-ver" />',
			$this->instance->present()
		);
	}

	/**
	 * Tests retrieving a Pinterest site verification string.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->assertSame(
			'pinterest-ver',
			$this->instance->get()
		);
	}
}
