<?php

namespace Yoast\WP\SEO\Tests\Helpers\Schema;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Image_Helper
 */
class Image_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Image_Helper
	 */
	private $instance;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper|Mockery\MockInterface
	 */
	private $html;

	/**
	 * The language helper.
	 *
	 * @var Mockery\MockInterface|Languge_Helper
	 */
	private $language;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );

		$this->instance = new Image_Helper( $this->html, $this->language );
	}

	/**
	 * Tests the generate_from_attachment_id method.
	 *
	 * @covers ::generate_from_attachment_id
	 * @covers ::generate_object
	 * @covers ::add_image_size
	 * @covers ::add_caption
	 */
	public function test_generate_from_attachment_id_with_caption_and_image_dimensions() {
		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'https://example.com/logo.jpg' );

		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->with( 1337 )
			->once()
			->andReturn(
				[
					'width'  => 256,
					'height' => 512,
				]
			);

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( function( $data ) {
				$data['inLanguage'] = 'language';
				return $data;
			} );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#logo',
			'url'        => 'https://example.com/logo.jpg',
			'width'      => 256,
			'height'     => 512,
			'caption'    => 'Company name',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $this->instance->generate_from_attachment_id(
			'https://example.com/#logo',
			1337,
			'Company name'
		) );
	}
}
