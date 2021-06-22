<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use Yoast\WP\SEO\Conditionals\Slovak_Support_Conditional;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Language_Helper_Test.
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
	 * The Slovak support conditional.
	 *
	 * @var Mockery\MockInterface|Slovak_Support_Conditional
	 */
	protected $slovak_conditional;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->slovak_conditional = Mockery::mock( Slovak_Support_Conditional::class );

		$this->instance = new Language_Helper( $this->slovak_conditional );
	}

	/**
	 * Tests the constructor by checking the set attributes.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf( Slovak_Support_Conditional::class, self::getPropertyValue( $this, 'slovak_conditional' ) );
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
		$this->slovak_conditional
			->expects( 'is_met' )
			->andReturnFalse();

		$this->assertTrue( $this->instance->is_word_form_recognition_active( $language ) );
	}

	/**
	 * Data provider for the test_is_word_form_recognition_active test.
	 *
	 * @return string[][] The dataset.
	 */
	public function supported_language_provider() {
		return [ [ 'de' ], [ 'en' ], [ 'es' ], [ 'fr' ], [ 'it' ], [ 'nl' ], [ 'ru' ], [ 'id' ], [ 'pt' ], [ 'pl' ], [ 'ar' ], [ 'sv' ], [ 'he' ], [ 'hu' ], [ 'nb' ], [ 'tr' ], [ 'cs' ], [ 'sk' ] ];
	}

	/**
	 * Tests that a given language has function word support.
	 *
	 * @covers ::has_function_word_support
	 *
	 * @dataProvider language_with_function_word_support_provider
	 *
	 * @param string $language The language to test.
	 */
	public function test_has_function_word_support( $language ) {
		$this->slovak_conditional
			->expects( 'is_met' )
			->andReturnFalse();

		$this->assertTrue( $this->instance->has_function_word_support( $language ) );
	}

	/**
	 * Data provider for the test_is_word_form_recognition_active test.
	 *
	 * @return string[][] The dataset.
	 */
	public function language_with_function_word_support_provider() {
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
		];
	}
}
