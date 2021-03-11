<?php

namespace Yoast\WP\SEO\Tests\Unit\Values;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Images;
use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\Validation_Error
 *
 * @group values
 */
class Validation_Error_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Validation_Error
	 */
	protected $instance;

	/**
	 * Setup the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Validation_Error( 'Message explaining the error.' );
	}

	/**
	 * Test that the constructor saves the error message on the right property.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertEquals(
			'Message explaining the error.',
			self::getPropertyValue( $this->instance, 'error_message' )
		);
	}

	/**
	 * Test that the get_error_message function returns the given error message.
	 *
	 * @covers ::get_error_message
	 */
	public function test_get_error_message() {
		self::assertEquals(
			'Message explaining the error.',
			$this->instance->get_error_message()
		);
	}
}
