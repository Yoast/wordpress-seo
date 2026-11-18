<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Bulk_Editor\Domain\Updates;

use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Error;
use Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for the Update_Result value object.
 *
 * @group Bulk_Editor
 *
 * @coversDefaultClass \Yoast\WP\SEO\Bulk_Editor\Domain\Updates\Update_Result
 */
final class Update_Result_Test extends TestCase {

	/**
	 * Tests creating a successful result.
	 *
	 * @covers ::__construct
	 * @covers ::for_success
	 * @covers ::get_post_id
	 * @covers ::is_success
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_for_success() {
		$instance = Update_Result::for_success( 123 );

		$this->assertSame( 123, $instance->get_post_id() );
		$this->assertTrue( $instance->is_success() );
		$this->assertNull( $instance->get_error_code() );
	}

	/**
	 * Tests creating a failed result.
	 *
	 * @covers ::__construct
	 * @covers ::for_failure
	 * @covers ::get_post_id
	 * @covers ::is_success
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_for_failure() {
		$instance = Update_Result::for_failure( 456, Update_Error::FORBIDDEN );

		$this->assertSame( 456, $instance->get_post_id() );
		$this->assertFalse( $instance->is_success() );
		$this->assertSame( Update_Error::FORBIDDEN, $instance->get_error_code() );
	}

	/**
	 * Tests the array representation of a successful result has no error key.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array_success() {
		$this->assertSame(
			[
				'id'      => 123,
				'success' => true,
			],
			Update_Result::for_success( 123 )->to_array(),
		);
	}

	/**
	 * Tests a successful result carries its rendered fields.
	 *
	 * @covers ::for_success
	 * @covers ::get_rendered
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_for_success_with_rendered_fields() {
		$rendered = [
			'seo_title'        => 'Rendered title',
			'meta_description' => 'Rendered description',
		];
		$instance = Update_Result::for_success( 123, $rendered );

		$this->assertSame( $rendered, $instance->get_rendered() );
		$this->assertSame(
			[
				'id'       => 123,
				'success'  => true,
				'rendered' => $rendered,
			],
			$instance->to_array(),
		);
	}

	/**
	 * Tests a successful result carries its sanitized fields separately from rendered.
	 *
	 * @covers ::for_success
	 * @covers ::get_sanitized
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_for_success_with_sanitized_fields() {
		$sanitized = [ 'focus_keyphrase' => 'clean keyphrase' ];
		$instance  = Update_Result::for_success( 123, [], $sanitized );

		$this->assertSame( $sanitized, $instance->get_sanitized() );
		$this->assertSame(
			[
				'id'        => 123,
				'success'   => true,
				'sanitized' => $sanitized,
			],
			$instance->to_array(),
		);
	}

	/**
	 * Tests the array representation of a failed result contains the error code.
	 *
	 * @covers ::to_array
	 *
	 * @return void
	 */
	public function test_to_array_failure() {
		$this->assertSame(
			[
				'id'      => 456,
				'success' => false,
				'error'   => Update_Error::NOT_FOUND,
			],
			Update_Result::for_failure( 456, Update_Error::NOT_FOUND )->to_array(),
		);
	}
}
