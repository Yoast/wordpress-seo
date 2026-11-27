<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Domain\Exceptions;

use Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Unavailable_Global_Setting_Target_Exception class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Domain\Exceptions\Unavailable_Global_Setting_Target_Exception
 */
final class Unavailable_Global_Setting_Target_Exception_Test extends TestCase {

	/**
	 * Tests that the exception carries its error code, its message and the 400 status.
	 *
	 * @covers ::__construct
	 * @covers ::get_error_code
	 *
	 * @return void
	 */
	public function test_exception() {
		$exception = new Unavailable_Global_Setting_Target_Exception( 'yoast_seo_static_homepage', 'The homepage is a static page.' );

		$this->assertSame( 'yoast_seo_static_homepage', $exception->get_error_code() );
		$this->assertSame( 'The homepage is a static page.', $exception->getMessage() );
		$this->assertSame( 400, $exception->getCode() );
	}
}
