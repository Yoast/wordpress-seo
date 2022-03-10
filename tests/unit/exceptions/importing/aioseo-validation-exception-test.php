<?php

namespace Yoast\WP\SEO\Tests\Unit\Exceptions\Importing;

use Yoast\WP\SEO\Exceptions\Importing\Aioseo_Validation_Exception;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Validation_Exception_Test
 *
 * @group exceptions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Exceptions\Indexable\Aioseo_Validation_Exception
 */
class Aioseo_Validation_Exception_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->stubTranslationFunctions();

		$instance = new Aioseo_Validation_Exception();

		$expected_message  = 'The AIOSEO import was cancelled because some AIOSEO data is missing. Please try and take the following steps to fix this:';
		$expected_message .= '<br/>';
		$expected_message .= '<ol><li>';
		$expected_message .= 'If you have never saved any AIOSEO \'Search Appearance\' settings, please do that first and run the import again.';
		$expected_message .= '</li>';
		$expected_message .= '<li>';
		$expected_message .= 'If you already have saved AIOSEO \'Search Appearance\' settings and the issue persists, please contact our support team so we can take a closer look.';
		$expected_message .= '</li></ol>';

		self::assertEquals(
			$expected_message,
			$instance->getMessage()
		);
	}
}
