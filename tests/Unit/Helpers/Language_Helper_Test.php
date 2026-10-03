<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Language_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Language_Helper
 *
 * @group helpers
 */
final class Language_Helper_Test extends TestCase {

	/**
	 * The language helper.
	 *
	 * @var Language_Helper
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
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
	 *
	 * @return void
	 */
	public function test_is_word_form_recognition_active( $language ) {
		$this->assertTrue( $this->instance->is_word_form_recognition_active( $language ) );
	}

	/**
	 * Data provider for the test_is_word_form_recognition_active test.
	 *
	 * @return string[][] The dataset.
	 */
	public static function supported_language_provider() {
		return [ [ 'de' ], [ 'en' ], [ 'es' ], [ 'fr' ], [ 'it' ], [ 'nl' ], [ 'ru' ], [ 'id' ], [ 'pt' ], [ 'pl' ], [ 'ar' ], [ 'sv' ], [ 'he' ], [ 'hu' ], [ 'nb' ], [ 'tr' ], [ 'cs' ], [ 'sk' ], [ 'el' ], [ 'ja' ] ];
	}

	/**
	 * Tests that a given language has function word support.
	 *
	 * @covers ::has_function_word_support
	 *
	 * @dataProvider language_with_function_word_support_provider
	 *
	 * @param string $language The language to test.
	 *
	 * @return void
	 */
	public function test_has_function_word_support( $language ) {
		$this->assertTrue( $this->instance->has_function_word_support( $language ) );
	}

	/**
	 * Data provider for the test_is_word_form_recognition_active test.
	 *
	 * @return string[][] The dataset.
	 */
	public static function language_with_function_word_support_provider() {
		return [
			[ 'en' ],
			[ 'de' ],
			[ 'nl' ],
			[ 'fr' ],
			[ 'es' ],
			[ 'it' ],
			[ 'pt' ],
			[ 'ru' ],
			[ 'pl' ],
			[ 'sv' ],
			[ 'id' ],
			[ 'he' ],
			[ 'ar' ],
			[ 'hu' ],
			[ 'nb' ],
			[ 'tr' ],
			[ 'cs' ],
			[ 'sk' ],
			[ 'fa' ],
			[ 'el' ],
			[ 'ja' ],
		];
	}

	/**
	 * Tests if all the languages that have inclusive language support are
	 * set to be supported in the code.
	 *
	 * @covers ::has_inclusive_language_support
	 *
	 * @return void
	 */
	public function test_has_inclusive_language_support() {
		$this->assertTrue( $this->instance->has_inclusive_language_support( 'en' ) );
	}
}
