<?php

namespace Yoast\WP\SEO\Tests\Unit\Exceptions\Importing;

use Yoast\WP\SEO\Exceptions\Importing\Aioseo_Validation_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Validation_Exception_Test
 *
 * @group exceptions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Exceptions\Importing\Aioseo_Validation_Exception
 */
final class Aioseo_Validation_Exception_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->stubTranslationFunctions();

		$instance = new Aioseo_Validation_Exception();

		self::assertEquals(
			'The validation of the AIOSEO data structure has failed.',
			$instance->getMessage()
		);
	}
}
