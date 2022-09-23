<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Twitter;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Twitter\Image_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->instance               = new Image_Presenter();
		$this->instance->presentation = new Indexable_Presentation();
		$this->presentation           = $this->instance->presentation;

		Monkey\Functions\expect( 'post_password_required' )->andReturn( false );
	}

	/**
	 * Tests whether the presenter returns the correct image.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->twitter_image = 'relative_image.jpg';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

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
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta name="twitter:image" content="relative_image.jpg" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct image when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->presentation->twitter_image = 'relative_image.jpg';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta name="twitter:image" content="relative_image.jpg" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}
