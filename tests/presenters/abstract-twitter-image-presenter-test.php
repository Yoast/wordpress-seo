<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Yoast\WP\Free\Presenters\Abstract_Twitter_Image_Presenter;
use Yoast\WP\Free\Tests\Doubles\Presenters\Abstract_Twitter_Image_Presenter_Double;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Image_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Abstract_Twitter_Image_Presenter
 *
 * @group twitter
 * @group twitter-image
 */
class Abstract_Twitter_Image_Presenter_Test extends TestCase {

	/**
	 * Tests the presentation of a relative image.
	 *
	 * @covers ::present
	 * @covers ::format
	 * @covers ::filter
	 */
	public function test_present() {
		$indexable = new Indexable();
		$instance  = \Mockery::mock( Abstract_Twitter_Image_Presenter::class )
		                     ->makePartial()
		                     ->shouldAllowMockingMethod('generate');

		$instance
			->expects( 'generate' )
			->with( $indexable )
			->once()
			->andReturn( '/relative_image.jpg' );

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
			$instance->present( $indexable )
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
		$indexable = new Indexable();
		$instance  = \Mockery::mock( Abstract_Twitter_Image_Presenter::class )
			->makePartial()
			->shouldAllowMockingMethod('generate');

		$instance
			->expects( 'generate' )
			->with( $indexable )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $instance->present( $indexable ) );
	}

	/**
	 * Tests retrieval of the default image with opengraph being disabled.
	 *
	 * @covers ::retrieve_default_image
	 */
	public function test_retrieve_default_image_with_opengraph_disabled() {
		$instance = \Mockery::mock( Abstract_Twitter_Image_Presenter_Double::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$instance
			->expects( 'opengraph_enabled' )
			->once()
			->andReturnFalse();

		$this->assertEmpty( $instance->retrieve_default_image() );
	}

	/**
	 * Tests retrieval of the default image with opengraph being enabled.
	 *
	 * @covers ::retrieve_default_image
	 */
	public function test_retrieve_default_image_with_opengraph_enabled() {
		$instance = \Mockery::mock( Abstract_Twitter_Image_Presenter_Double::class )
		                    ->makePartial()
		                    ->shouldAllowMockingProtectedMethods();

		$instance
			->expects( 'opengraph_enabled' )
			->once()
			->andReturnTrue();

		$this->assertEmpty( $instance->retrieve_default_image() );
	}


	/**
	 * Tests retrieval of the social image with twitter image being set.
	 *
	 * @covers ::retrieve_social_image
	 */
	public function test_retrieve_social_image_with_twitter_image_set() {
		$instance  = new Abstract_Twitter_Image_Presenter_Double();
		$indexable = new Indexable();
		$indexable->twitter_image = 'twitter_image.jpg';

		$this->assertEquals( 'twitter_image.jpg', $instance->retrieve_social_image( $indexable ) );
	}

	/**
	 * Tests retrieval of the social image with no twitter and not opengraph image being set.
	 *
	 * @covers ::retrieve_social_image
	 */
	public function test_retrieve_social_image_with_no_twitter_and_opengraph_image_set() {
		$instance  = new Abstract_Twitter_Image_Presenter_Double();
		$indexable = new Indexable();

		$this->assertEquals( '', $instance->retrieve_social_image( $indexable ) );
	}

	/**
	 * Tests retrieval of the social image with twitter image being set.
	 *
	 * @covers ::retrieve_social_image
	 */
	public function test_retrieve_social_image_with_opengraph_falback_and_opengraph_disabled() {
		$instance = \Mockery::mock( Abstract_Twitter_Image_Presenter_Double::class )
		                    ->makePartial()
		                    ->shouldAllowMockingProtectedMethods();

		$indexable = new Indexable();
		$indexable->og_image = 'opengraph_image.jpg';

		$instance
			->expects( 'opengraph_enabled' )
			->once()
			->andReturnFalse();

		$this->assertEquals( '', $instance->retrieve_social_image( $indexable ) );
	}

	/**
	 * Tests retrieval of the social image with twitter image being set.
	 *
	 * @covers ::retrieve_social_image
	 */
	public function test_retrieve_social_image_with_opengraph_falback_and_opengraph_enabled() {
		$instance = \Mockery::mock( Abstract_Twitter_Image_Presenter_Double::class )
		                    ->makePartial()
		                    ->shouldAllowMockingProtectedMethods();

		$indexable = new Indexable();
		$indexable->og_image = 'opengraph_image.jpg';

		$instance
			->expects( 'opengraph_enabled' )
			->once()
			->andReturnTrue();

		$this->assertEquals( 'opengraph_image.jpg', $instance->retrieve_social_image( $indexable ) );
	}
}
