<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Presentation;

use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Twitter_Image_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 */
final class Twitter_Image_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->set_instance();
	}

	/**
	 * Tests the situation where a user defined Twitter image is given.
	 *
	 * @covers ::generate_twitter_image
	 *
	 * @dataProvider twitter_image_provider
	 *
	 * @param string $image_source   Twitter image source.
	 * @param array  $image_generate Return value of twitter image generator.
	 * @param string $expected       Expected value.
	 *
	 * @return void
	 */
	public function test_generate_twitter_image( $image_source, $image_generate, $expected ) {
		$this->indexable->twitter_image_source = $image_source;
		$this->context->open_graph_enabled     = false;

		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( $image_generate );

		$this->assertEquals( $expected, $this->instance->generate_twitter_image() );
	}

	/**
	 * Tests the situation where a user defined Twitter image is given.
	 *
	 * @covers ::generate_twitter_image
	 *
	 * @dataProvider twitter_image_open_graph_fallback_provider
	 *
	 * @param string $image_source     Twitter image source.
	 * @param array  $image_generate   Return value of twitter image generator.
	 * @param string $open_graph_image Return value of Open Graph image generator.
	 * @param string $expected         Expected value.
	 *
	 * @return void
	 */
	public function test_generate_twitter_image_with_open_graph_fallback( $image_source, $image_generate, $open_graph_image, $expected ) {
		$this->indexable->twitter_image_source = $image_source;
		$this->context->open_graph_enabled     = true;

		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn( $image_generate );

		$this->instance
			->expects( 'generate_open_graph_images' )
			->once()
			->andReturn( $open_graph_image );

		$this->assertEquals( $expected, $this->instance->generate_twitter_image() );
	}

	/**
	 * Provides data to the image provider, with Open Graph disabled.
	 *
	 * @return array The data to provide.
	 */
	public static function twitter_image_provider() {
		return [
			[
				'image_source'    => 'set-by-user',
				'generated_image' => [
					'twitter_image.jpg' => [
						'url' => 'twitter_image.jpg',
					],
				],
				'expected'        => 'twitter_image.jpg',
			],
			[
				'image_source'    => 'featured-image',
				'generated_image' => [
					'featured_image.jpg' => [
						'url' => 'featured_image.jpg',
					],
				],
				'expected'        => 'featured_image.jpg',
			],
			[
				'image_source'    => 'featured-image',
				'generated_image' => [],
				'expected'        => '',
			],
		];
	}

	/**
	 * Provides data to the image provider, with Open Graph enabled.
	 *
	 * @return array The data to provide.
	 */
	public static function twitter_image_open_graph_fallback_provider() {
		return [
			[
				'image_source'              => 'featured-image',
				'generated_image'           => [
					'twitter_image.jpg' => [
						'url' => 'twitter_image.jpg',
					],
				],
				'open_graph_generate_image' => 'open_graph_image.jpg',
				'expected'                  => '',
			],
			[
				'image_source'              => 'featured-image',
				'generated_image'           => [
					'twitter_image.jpg' => [
						'url' => 'twitter_image.jpg',
					],
				],
				'open_graph_generate_image' => '',
				'expected'                  => 'twitter_image.jpg',
			],
			[
				'image_source'              => 'featured-image',
				'generated_image'           => [],
				'open_graph_generate_image' => '',
				'expected'                  => '',
			],
		];
	}
}
