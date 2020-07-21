<?php

namespace Yoast\WP\SEO\Tests\Presenters\Twitter;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Image_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Image_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Twitter\Image_Presenter
 *
 * @group presenters
 * @group twitter
 * @group twitter-image
 */
class Image_Presenter_Test extends TestCase {

	/**
	 * The image presenter instance.
	 *
	 * @var Image_Presenter
	 */
	private $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->instance               = new Image_Presenter();
		$this->instance->presentation = new Indexable_Presentation();
		$this->presentation           = $this->instance->presentation;

		parent::setUp();

		Monkey\Functions\expect( 'post_password_required' )->andReturn( false );
	}

	/**
	 * Tests whether the presenter returns the correct image.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->twitter_image = 'relative_image.jpg';

		$expected = '<meta name="twitter:image" content="relative_image.jpg" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty image.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_image() {
		$this->presentation->twitter_image = '';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests whether the presenter returns the correct image,
	 * when the `wpseo_twitter_image` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->twitter_image = 'relative_image.jpg';

		Monkey\Filters\expectApplied( 'wpseo_twitter_image' )
			->once()
			->with( 'relative_image.jpg', $this->presentation )
			->andReturn( 'relative_image.jpg' );

		$expected = '<meta name="twitter:image" content="relative_image.jpg" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}
