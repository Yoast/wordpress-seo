<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Image_Helper as Main_Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * @var Image_Helper|Mockery\MockInterface
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
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language;

	/**
	 * The main image helper.
	 *
	 * @var Mockery\MockInterface|Main_Image_Helper
	 */
	private $image;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );
		$this->image    = Mockery::mock( Main_Image_Helper::class );

		$this->instance = Mockery::mock( Image_Helper::class, [ $this->html, $this->language, $this->image ] )->makePartial();
	}

	/**
	 * Tests generating the schema from url with a found attachment id.
	 *
	 * @covers ::generate_from_url
	 */
	public function test_generate_from_url_with_found_attachment_id() {
		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'https://example.org/image.jpg' )
			->andReturn( 1337 );

		$this->instance
			->expects( 'generate_from_attachment_id' )
			->once()
			->with( '#schema-image-ABC', 1337, 'caption', false )
			->andReturn( [] );

		$this->assertEquals(
			[],
			$this->instance->generate_from_url( '#schema-image-ABC', 'https://example.org/image.jpg', 'caption' )
		);
	}

	/**
	 * Tests generating the schema from url no found attachment id.
	 *
	 * @covers ::generate_from_url
	 */
	public function test_generate_from_url_with_no_found_attachment_id() {
		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'https://example.org/image.jpg' )
			->andReturn( 0 );

		$this->instance
			->expects( 'simple_image_object' )
			->once()
			->with( '#schema-image-ABC', 'https://example.org/image.jpg', 'caption', false )
			->andReturn( [] );

		$this->assertEquals(
			[],
			$this->instance->generate_from_url( '#schema-image-ABC', 'https://example.org/image.jpg', 'caption' )
		);
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
		$this->image
			->expects( 'get_attachment_image_url' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'https://example.com/logo.jpg' );

		$this->image
			->expects( 'get_metadata' )
			->with( 1337 )
			->once()
			->andReturn(
				[
					'width'  => 256,
					'height' => 512,
				]
			);

		$this->language
			->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#/schema/logo/image/',
			'url'        => 'https://example.com/logo.jpg',
			'contentUrl' => 'https://example.com/logo.jpg',
			'width'      => 256,
			'height'     => 512,
			'caption'    => 'Company name',
			'inLanguage' => 'language',
		];

		$this->assertEquals(
			$expected,
			$this->instance->generate_from_attachment_id(
				'https://example.com/#/schema/logo/image/',
				1337,
				'Company name'
			)
		);
	}

	/**
	 * Tests the generate_from_attachment_id method.
	 *
	 * @covers ::generate_from_attachment_id
	 * @covers ::generate_object
	 * @covers ::add_caption
	 */
	public function test_generate_from_attachment_id_with_caption_given() {
		$this->image
			->expects( 'get_attachment_image_url' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'https://example.com/logo.jpg' );

		$this->image
			->expects( 'get_metadata' )
			->with( 1337 )
			->once()
			->andReturn( [] );

		$this->language
			->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#/schema/logo/image/',
			'url'        => 'https://example.com/logo.jpg',
			'contentUrl' => 'https://example.com/logo.jpg',
			'caption'    => 'Company name',
			'inLanguage' => 'language',
		];

		$this->assertEquals(
			$expected,
			$this->instance->generate_from_attachment_id(
				'https://example.com/#/schema/logo/image/',
				1337,
				'Company name'
			)
		);
	}

	/**
	 * Tests the generate_from_attachment_id method with no caption given, but fallback
	 * to the default caption.
	 *
	 * @covers ::generate_from_attachment_id
	 * @covers ::generate_object
	 * @covers ::add_image_size
	 * @covers ::add_caption
	 */
	public function test_generate_from_attachment_id_with_no_caption_given() {
		$this->image
			->expects( 'get_attachment_image_url' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'https://example.com/logo.jpg' );

		$this->image
			->expects( 'get_metadata' )
			->with( 1337 )
			->once()
			->andReturn( [] );

		$this->image
			->expects( 'get_caption' )
			->once()
			->with( 1337 )
			->andReturn( 'Image caption' );

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->with( 'Image caption' )
			->andReturn( 'Image caption' );

		$this->language
			->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#/schema/logo/image/',
			'url'        => 'https://example.com/logo.jpg',
			'contentUrl' => 'https://example.com/logo.jpg',
			'caption'    => 'Image caption',
			'inLanguage' => 'language',
		];

		$actual = $this->instance->generate_from_attachment_id(
			'https://example.com/#/schema/logo/image/',
			1337,
			''
		);

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the generate_from_attachment_id method with no caption given, but fallback
	 * to the default caption.
	 *
	 * @covers ::generate_from_attachment_id
	 * @covers ::generate_object
	 * @covers ::add_image_size
	 * @covers ::add_caption
	 */
	public function test_generate_from_attachment_id_with_no_caption_given_and_no_alternative() {
		$this->image
			->expects( 'get_attachment_image_url' )
			->with( 1337, 'full' )
			->once()
			->andReturn( 'https://example.com/logo.jpg' );

		$this->image
			->expects( 'get_metadata' )
			->with( 1337 )
			->once()
			->andReturn( [] );

		$this->image
			->expects( 'get_caption' )
			->once()
			->with( 1337 )
			->andReturn( '' );

		$this->language
			->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#/schema/logo/image/',
			'url'        => 'https://example.com/logo.jpg',
			'contentUrl' => 'https://example.com/logo.jpg',
			'inLanguage' => 'language',
		];

		$actual = $this->instance->generate_from_attachment_id(
			'https://example.com/#/schema/logo/image/',
			1337,
			''
		);

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the simple_image_object method.
	 *
	 * @covers ::simple_image_object
	 * @covers ::generate_object
	 * @covers ::add_image_size
	 * @covers ::add_caption
	 */
	public function test_simple_image_object() {

		$this->language
			->expects( 'add_piece_language' )
			->once()
			->andReturnUsing( [ $this, 'set_language' ] );

		$expected = [
			'@type'      => 'ImageObject',
			'@id'        => 'https://example.com/#/schema/logo/image/',
			'url'        => 'https://example.com/logo.jpg',
			'contentUrl' => 'https://example.com/logo.jpg',
			'inLanguage' => 'language',
			'caption'    => 'Image caption',
		];

		$this->html
			->expects( 'smart_strip_tags' )
			->once()
			->with( 'Image caption' )
			->andReturn( 'Image caption' );

		$actual = $this->instance->simple_image_object(
			'https://example.com/#/schema/logo/image/',
			'https://example.com/logo.jpg',
			'Image caption'
		);

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Sets the language.
	 *
	 * @param array $data The data to extend.
	 *
	 * @return array The altered data
	 */
	public function set_language( $data ) {
		$data['inLanguage'] = 'language';

		return $data;
	}
}
