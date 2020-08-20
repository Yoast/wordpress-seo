<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Language_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Language_Helper
 *
 * @group helpers
 */
class Language_Helper_Test extends TestCase {

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();
		$this->instance = new Language_Helper();
	}

	/**
	 * Tests that a given language has word form recognition support.
	 *
	 * @covers ::is_word_form_recognition_active
	 *
	 * @dataProvider supported_language_provider
	 *
	 * @param string $language The language to test.
	 */
	public function test_is_word_form_recognition_active( $language ) {
		$this->assertTrue( $this->instance->is_word_form_recognition_active( $language ) );
	}

	/**
	 * Data provider for the test_is_word_form_recognition_active test.
	 *
	 * @return string[][] The dataset.
	 */
	public function supported_language_provider() {
		return [ [ 'de' ], [ 'en' ], [ 'es' ], [ 'fr' ], [ 'it' ], [ 'nl' ], [ 'ru' ] ];
	}
}
