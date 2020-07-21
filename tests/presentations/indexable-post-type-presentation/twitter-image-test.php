<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Twitter_Image_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-image
 */
class Twitter_Image_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests the situation where the post is password protected.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_for_password_protected_post() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where the Twitter image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_generate_twitter_image() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->indexable->twitter_image_source = 'set-by-user';

		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn(
				[
					'twitter_image.jpg' => [
						'url' => 'twitter_image.jpg',
					],
				]
			);

		$this->assertEquals( 'twitter_image.jpg', $this->instance->generate_twitter_image() );
	}
}
