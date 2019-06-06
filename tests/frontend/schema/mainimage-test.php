<?php

namespace Yoast\WP\Free\Tests\Frontend\Schema;

use Brain\Monkey;
use Mockery;
use WPSEO_Schema_Context;
use WPSEO_Schema_MainImage;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 */
class MainImage_Test extends TestCase {

	/** @var \WPSEO_Schema_Context null */
	private $context = null;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();
		$this->context = Mockery::mock( WPSEO_Schema_Context::class )->makePartial();
	}

	/**
	 * Tears down the test class.
	 */
	public function tearDown() {
		$context = null;
		parent::tearDown();
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

		$class_instance = new WPSEO_Schema_MainImage( $this->context );

		$this->assertEquals( true, $class_instance->is_needed() );
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

		$class_instance = new WPSEO_Schema_MainImage( $this->context );

		$this->assertEquals( false, $class_instance->is_needed() );
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

		Monkey\Functions\expect( 'get_post' )
			->times( 1 )
			->andReturn( null );

		$class_instance = new WPSEO_Schema_MainImage( $this->context );

		$this->assertSame(
			false,
			$class_instance->generate()
		);
	}

	/**
	 * Tests that generate with a featured image has proper image schema.
	 *
	 * @covers \WPSEO_Schema_MainImage::generate
	 * @covers \WPSEO_Schema_MainImage::get_featured_image
	 */
	public function test_generate_with_a_featured_image() {
		$this->context->id        = 1;
		$this->context->canonical = 'https://example.com/mainimage-test';

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->times( 1 )
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->times( 1 )
			->andReturn( $this->context->id );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->times( 1 )
			->andReturn( 'https://example.com/image' );

		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->times( 1 )
			->with( $this->context->id )
			->andReturn( [
				'width'  => 111,
				'height' => 222,
			] );

		Monkey\Functions\expect( 'wp_get_attachment_caption' )
			->times( 1 )
			->andReturn( 'caption' );

		$class_instance = new WPSEO_Schema_MainImage( $this->context );

		$this->assertEquals(
			[
				'@type'   => 'ImageObject',
				'@id'     => 'https://example.com/mainimage-test#primaryimage',
				'url'     => 'https://example.com/image',
				'width'   => 111,
				'height'  => 222,
				'caption' => 'caption',
			],
			$class_instance->generate()
		);
		$this->assertSame( true, $this->context->has_image );
	}

	/**
	 * Tests that generate with a content image has proper image schema.
	 *
	 * @covers \WPSEO_Schema_MainImage::generate
	 * @covers \WPSEO_Schema_MainImage::get_featured_image
	 * @covers \WPSEO_Schema_MainImage::get_first_content_image
	 */
	public function test_generate_with_a_content_image() {
		$this->context->id        = 1;
		$this->context->canonical = 'https://example.com/mainimage-test';

		Monkey\Functions\expect( 'has_post_thumbnail' )
			->times( 1 )
			->andReturn( false );

		Monkey\Functions\expect( 'get_post' )
			->times( 1 )
			->andReturn( (object) [
				'ID'           => $this->context->id,
				'post_content' => '<img src="https://example.com/" />',
			] );

		Monkey\Functions\expect( 'wp_cache_get' )
			->times( 1 )
			->andReturn( $this->context->id );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->times( 1 )
			->andReturn( 'https://example.com/image' );

		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->times( 1 )
			->with( $this->context->id )
			->andReturn( [
				'width'  => 111,
				'height' => 222,
			] );

		Monkey\Functions\expect( 'wp_get_attachment_caption' )
			->times( 1 )
			->andReturn( 'caption' );

		$class_instance = new WPSEO_Schema_MainImage( $this->context );

		$this->assertEquals(
			[
				'@type'   => 'ImageObject',
				'@id'     => 'https://example.com/mainimage-test#primaryimage',
				'url'     => 'https://example.com/image',
				'width'   => 111,
				'height'  => 222,
				'caption' => 'caption',
			],
			$class_instance->generate()
		);
		$this->assertSame( true, $this->context->has_image );
	}
}
