<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Image_Presenter;
use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Image_Presenter
 *
 * @group presentations
 * @group twitter
 * @group twitter-image
 */
class Image_Presenter_Test extends TestCase {

	/**
	 * @var Image_Presenter
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->instance   = new Image_Presenter();

		parent::setUp();

		Monkey\Functions\expect( 'post_password_required' )->andReturn( false );
	}

	/**
	 * Tests the presentation of a relative image.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present() {
		$presentation = new Indexable_Presentation();
		$presentation->twitter_image = 'relative_image.jpg';

		$this->assertEquals(
			'<meta name="twitter:image" content="relative_image.jpg" />',
			$this->instance->present( $presentation )
		);
	}
}
