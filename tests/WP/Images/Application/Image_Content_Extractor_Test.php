<?php

namespace Yoast\WP\SEO\Tests\WP\Images\Application;

use Yoast\WP\SEO\Images\Application\Image_Content_Extractor;
use Yoast\WP\SEO\Tests\WP\TestCase;

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
	public function set_up(): void {
		parent::set_up();
		$this->instance = new Image_Content_Extractor();
	}

	/**
	 * Data provider fr testing the gather_images_wp function.
	 *
	 * @return array<string,array<string,string|array<string,int>>> The test data.
	 */
	public function gather_images_wp_provider(): array {
		return [
			'no src' => [
				'content'  => '<img />',
				'expected' => [],
			],
			'typo of src' => [
				'content'  => "<img srcc='https://link.com/newly-added-in-post' class='wp-image-8' />",
				'expected' => [],
			],
			'no image' => [
				'content'  => '<h1>Test</h1>',
				'expected' => [],
			],
			'with valid image' => [
				'content'  => "<img src='https://link.com/newly-added-in-post' class='wp-image-8' />",
				'expected' => [
					'https://link.com/newly-added-in-post' => 8,
				],
			],
		];
	}

	/**
	 * Tests the build function.
	 *
	 * @dataProvider gather_images_wp_provider
	 *
	 * @covers ::__construct
	 * @covers ::gather_images
	 * @covers ::gather_images_wp
	 *
	 * @param string            $content  The content.
	 * @param array<string,int> $expected The expected result.
	 *
	 * @return void
	 */
	public function test_gather_images_wp( $content, $expected ) {

		$this->assertEquals( $expected, $this->instance->gather_images( $content ) );
	}
}
