<?php

namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\Application;

use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Failed_Exception;
use Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Registration_Not_Found_Exception class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception
 */
final class Registration_Not_Found_Exception_Test extends TestCase {

	/**
	 * Tests that it extends Registration_Failed_Exception so existing catch
	 * sites keep working.
	 *
	 * @covers \Yoast\WP\SEO\MyYoast_Client\Application\Exceptions\Registration_Not_Found_Exception
	 *
	 * @return void
	 */
	public function test_extends_registration_failed_exception() {
		$exception = new Registration_Not_Found_Exception( 'Gone.' );

		$this->assertInstanceOf( Registration_Failed_Exception::class, $exception );
		$this->assertSame( 'Gone.', $exception->getMessage() );
	}
}
