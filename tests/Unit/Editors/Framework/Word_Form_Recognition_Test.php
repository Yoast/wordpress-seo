<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Mockery;
use Yoast\WP\SEO\Editors\Framework\Word_Form_Recognition;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Word_Form_Recognition_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Word_Form_Recognition
 */
final class Word_Form_Recognition_Test extends TestCase {

	/**
	 * Holds the Language_Helper instance.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language;

	/**
	 * The Word_Form_Recognition.
	 *
	 * @var Word_Form_Recognition
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->language = Mockery::mock( Language_Helper::class );

		$this->instance = new Word_Form_Recognition( $this->language );
	}

	/**
	 * Tests the getters.
	 *
	 * @covers ::__construct
	 * @covers ::get_name
	 * @covers ::get_legacy_key
	 *
	 * @return void
	 */
	public function test_getters(): void {
		$this->assertSame( 'wordFormRecognition', $this->instance->get_name() );
		$this->assertSame( 'wordFormRecognitionActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $is_word_form_recognition_active If the current language is supported.
	 * @param bool $expected                        The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( bool $is_word_form_recognition_active, bool $expected ): void {
		$this->language
			->expects( 'is_word_form_recognition_active' )
			->with( 'language' )
			->andReturn( $is_word_form_recognition_active );

		$this->language
			->expects( 'get_language' )->andReturn( 'language' );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled(): array {
		return [
			'Enabled' => [
				'is_word_form_recognition_active' => true,
				'expected'                        => true,
			],
			'Disabled' => [
				'is_word_form_recognition_active' => false,
				'expected'                        => false,
			],
		];
	}
}
