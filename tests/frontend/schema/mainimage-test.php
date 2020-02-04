<?php

namespace Yoast\WP\SEO\Tests\Frontend\Schema;

use Brain\Monkey;
use Mockery;
use WPSEO_Schema_Context;
use Yoast\WP\SEO\Tests\Doubles\Frontend\Schema\Schema_MainImage_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 */
class MainImage_Test extends TestCase {

	/**
	 * The schema context.
	 *
	 * @var \WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * Test instance that is test
	 *
	 * @var \Yoast\WP\SEO\Tests\Doubles\Frontend\Schema\Schema_MainImage_Double
	 */
	private $instance;

	/**
	 * Attachment data values.
	 *
	 * @var array
	 */
	private $schema_from_attachment;

	/**
	 * URL data values.
	 *
	 * @var array
	 */
	private $schema_from_url;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->context            = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();
		$this->context->id        = 1;
		$this->context->site_url  = 'https://example.com/';
		$this->context->canonical = $this->context->site_url . 'canonical/';

		$this->schema_from_attachment = [
			'@type'   => 'ImageObject',
			'@id'     => $this->context->canonical . '#primaryimage',
			'url'     => $this->context->site_url . 'attachment-image.jpg',
			'width'   => 111,
			'height'  => 222,
			'caption' => 'image caption',
		];

		$this->schema_from_url = [
			'@type' => 'ImageObject',
			'@id'   => $this->context->canonical . '#primaryimage',
			'url'   => $this->context->site_url . 'content-image.jpg',
		];

		$this->instance = $this->getMockBuilder( Schema_MainImage_Double::class )
			->setMethods(
				[
					'get_first_usable_content_image_for_post',
					'generate_image_schema_from_attachment_id',
					'generate_image_schema_from_url',
				]
			)
			->setConstructorArgs( [ $this->context ] )
			->getMock();
	}

	/**
	 * Tests that the main image is needed when is_singular returns true.
	 *
	 * @covers \WPSEO_Schema_MainImage::is_needed
	 */
	public function test_is_needed() {
		Monkey\Functions\expect( 'is_singular' )
			->times( 1 )
			->andReturn( true );

		$this->assertEquals( true, $this->instance->is_needed() );
	}

	/**
	 * Tests that the main image is needed when is_singular returns false.
	 *
	 * @covers \WPSEO_Schema_MainImage::is_needed
	 */
	public function test_is_needed_not_singular() {
		Monkey\Functions\expect( 'is_singular' )
			->times( 1 )
			->andReturn( false );

		$this->assertEquals( false, $this->instance->is_needed() );
	}

	/**
	 * Tests that generate without a post returns false.
	 *
	 * @covers \WPSEO_Schema_MainImage::generate
	 * @covers \WPSEO_Schema_MainImage::get_featured_image
	 * @covers \WPSEO_Schema_MainImage::get_first_content_image
	 */
	public function test_generate_with_an_invalid_post() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->times( 1 )
			->andReturn( false );

		$this->instance
			->method( 'get_first_usable_content_image_for_post' )
			->willReturn( null );

		$this->assertFalse( $this->instance->generate() );
	}

	/**
	 * Tests that generate with a featured image has proper image schema.
	 *
	 * @covers \WPSEO_Schema_MainImage::generate
	 * @covers \WPSEO_Schema_MainImage::get_featured_image
	 */
	public function test_generate_with_a_featured_image() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( true );

		$this->instance
			->method( 'generate_image_schema_from_attachment_id' )
			->willReturn( $this->schema_from_attachment );

		$this->assertEquals(
			$this->schema_from_attachment,
			$this->instance->generate()
		);
		$this->assertTrue( $this->context->has_image );
	}

	/**
	 * Tests that generate with a content image has proper image schema.
	 *
	 * @covers \WPSEO_Schema_MainImage::generate
	 * @covers \WPSEO_Schema_MainImage::get_featured_image
	 * @covers \WPSEO_Schema_MainImage::get_first_content_image
	 */
	public function test_generate_with_a_content_image() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->andReturn( false );

		$this->instance
			->method( 'get_first_usable_content_image_for_post' )
			->willReturn( $this->context->site_url . 'wp-content/uploads/content-image.jpg' );

		$this->instance
			->method( 'generate_image_schema_from_url' )
			->willReturn( $this->schema_from_url );

		$this->assertEquals(
			$this->schema_from_url,
			$this->instance->generate()
		);
		$this->assertTrue( $this->context->has_image );
	}
}
