<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Twitter_Image_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
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
	 * Tests the situation where the Twitter image is given.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_generate_twitter_image() {
		$this->indexable->twitter_image = 'twitter_image.jpg';

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

	/**
	 * Tests the situation where an empty value is returned and Open Graph is disabled.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_generate_twitter_image_with_empty_return_value_and_open_graph_disabled() {
		$this->context->open_graph_enabled = false;

		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( [] );

		$this->assertEmpty( $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where an empty value is returned and Open Graph is enabled and is giving
	 * an image.
	 *
	 * @covers ::generate_twitter_image
	 */
	public function test_generate_twitter_image_with_empty_return_value_and_open_graph_enabled() {
		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( [] );

		$this->og_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn(
				[
					'og_image.jpg' => [
						'url' => 'og_image.jpg',
					],
				]
			);

		$this->assertEquals( 'og_image.jpg', $this->instance->generate_twitter_image() );
	}
}
