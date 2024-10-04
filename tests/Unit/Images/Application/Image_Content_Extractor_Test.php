<?php

namespace Yoast\WP\SEO\Tests\Unit\Images\Application;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Images\Application\Image_Content_Extractor;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Content_Extractor_Test.
 *
 * @group images
 *
 * @coversDefaultClass \Yoast\WP\SEO\Images\Application\Image_Content_Extractor
 * @covers \Yoast\WP\SEO\Images\Application\Image_Content_Extractor
 */
final class Image_Content_Extractor_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Image_Content_Extractor
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Image_Content_Extractor();
	}

	/**
	 * Data provider to test the build.
	 *
	 * @return array<string|array<string>> The test data.
	 */
	public static function build_provider() {
		return [
			[
				false,
				true,
				true,
				'<img src="https://link.com/newly-added-in-post" class="wp-image-8" />',
				[
					'https://link.com/newly-added-in-post'  => 8,
				],
			],
			[
				true,
				false,
				false,
				'<img src="https://link.com/newly-added-in-post" class="wp-image-8" />',
				[
					'https://link.com/newly-added-in-post'  => 0,
				],
			],
		];
	}

	/**
	 * Tests the build function.
	 *
	 * @covers ::__construct
	 * @covers ::gather_images
	 * @covers ::gather_images_wp
	 * @covers ::gather_images_domdocument
	 * @covers ::extract_id_of_classes
	 *
	 * @dataProvider build_provider
	 *
	 * @param bool $ignore_content_scan  Whether content scanning should be ignored.
	 * @param bool $should_content_regex Whether the image id should be extracted with a regex.
	 * @param bool $should_doc_scan      Whether the doc document should be used.
	 * @param bool $content              The content to check.
	 * @param bool $expected             The expected result.
	 *
	 * @return void
	 */
	public function test_gather_images( $ignore_content_scan, $should_content_regex, $should_doc_scan, $content, $expected ) {
		if ( $should_doc_scan ) {
			Functions\expect( 'apply_filters' )
				->once()
				->with( 'wpseo_image_attribute_containing_id', 'class' )
				->andReturn( 'class' );

		}
		if ( $should_content_regex ) {
			Functions\expect( 'apply_filters' )
				->once()
				->with( 'wpseo_extract_id_pattern', '/(?<!\S)wp-image-(\d+)(?!\S)/i' )
				->andReturn( '/(?<!\S)wp-image-(\d+)(?!\S)/i' );
		}
		if ( $ignore_content_scan ) {
			Functions\expect( 'apply_filters' )
				->once()
				->with( 'wpseo_force_skip_image_content_parsing', false )
				->andReturn( true );
		}

		$this->assertEquals( $expected, $this->instance->gather_images( $content ) );
	}
}
