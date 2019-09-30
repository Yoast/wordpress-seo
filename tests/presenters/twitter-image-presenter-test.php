<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Twitter\Image_Presenter;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Twitter\Image_Presenter
 *
 * @group presentations
 * @group twitter
 * @group twitter-image
 */
class Twitter_Image_Presenter_Test extends TestCase {

	/**
	 * @var Url_Helper|Mockery\MockInterface
	 */
	private $url_helper;

	/**
	 * @var Image_Presenter
	 */
	private $instance;

	/**
	 * Sets an instance with the mocked url helper.
	 */
	public function setUp() {
		$this->url_helper = Mockery::mock( Url_Helper::class )->makePartial();
		$this->instance   = new Image_Presenter( $this->url_helper );

		parent::setUp();

		Monkey\Functions\expect( 'post_password_required' )->andReturn( false );
	}

	/**
	 * Tests the presentation of a relative image.
	 *
	 * @covers ::present
	 * @covers ::format
	 * @covers ::filter
	 */
	public function test_present() {
		$presentation = new Indexable_Presentation();
		$presentation->twitter_image = '/relative_image.jpg';

		$this->url_helper
			->expects( 'is_relative' )
			->once()
			->andReturnTrue();

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org' )
			->once()
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.org'
				]
			);

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.org' );

		$this->assertEquals(
			'<meta name="twitter:image" content="https://example.org/relative_image.jpg" />',
			$this->instance->present( $presentation )
		);
	}

	/**
	 * Tests retrieval of the default image with opengraph being disabled.
	 *
	 * @covers ::present
	 * @covers ::format
	 * @covers ::filter
	 */
	public function test_present_with_wrong_image_type_returned() {
		$presentation = new Indexable_Presentation();
		$presentation->twitter_image = '';

		$this->url_helper
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $this->instance->present( $presentation ) );
	}
}
