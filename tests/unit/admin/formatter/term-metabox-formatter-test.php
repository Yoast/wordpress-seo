<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Formatter;

use Brain\Monkey;
use Mockery;
use stdClass;
use WP_Term;
use Yoast\WP\SEO\Tests\Unit\Doubles\Admin\Formatter\Term_Metabox_Formatter_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Term_Metabox_Formatter
 *
 * @group Formatter
 */
class Term_Metabox_Formatter_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Term_Metabox_Formatter_Double
	 */
	private $instance;

	/**
	 * Mocked stdClass.
	 *
	 * @var stdClass
	 */
	private $taxonomy;

	/**
	 * Mocked WP_Term.
	 *
	 * @var WP_Term
	 */
	private $mock_term;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();

		$this->taxonomy           = (object) [];
		$this->mock_term          = Mockery::mock( '\WP_Term' )->makePartial();
		$this->mock_term->term_id = 1;

		$this->instance = new Term_Metabox_Formatter_Double( $this->taxonomy, $this->mock_term );
	}

	/**
	 * Get the image URL when there are no images in the description.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_description_has_no_images() {
		$expected = null;

		Monkey\Functions\expect( 'get_first_content_image_for_term' )
			->andReturn( [] );
		Monkey\Functions\expect( 'term_description' )
			->andReturn( 'Description without image' );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when there is one image in the description.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_description_has_one_image() {
		$expected = 'https://example.com/media/first_image.jpg';

		Monkey\Functions\expect( 'get_first_content_image_for_term' )
			->andReturn( [ 'https://example.com/media/first_image.jpg' ] );
		Monkey\Functions\expect( 'term_description' )
			->andReturn( 'Description with one image: <img src="https://example.com/media/first_image.jpg"/> And no more.' );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}

	/**
	 * Get the image URL when there are multiple images in the description.
	 *
	 * @covers ::get_image_url
	 */
	public function test_get_image_url_description_has_multiple_images() {
		$expected = 'https://example.com/media/first_image.jpg';

		Monkey\Functions\expect( 'get_first_content_image_for_term' )
			->andReturn( [ 'https://example.com/media/first_image.jpg' ] );
		Monkey\Functions\expect( 'term_description' )
			->andReturn( 'Description with two images: <img src="https://example.com/media/first_image.jpg"/><img src="https://example.com/media/second_image.jpg"/> And no more' );

		$url = $this->instance->get_image_url();

		$this->assertEquals( $expected, $url );
	}
}
