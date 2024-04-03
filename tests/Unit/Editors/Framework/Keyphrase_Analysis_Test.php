<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Keyphrase_Analysis_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Keyphrase_Analysis
 */
final class Keyphrase_Analysis_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The Keyphrase_Analysis.
	 *
	 * @var Keyphrase_Analysis
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->options = Mockery::mock( Options_Helper::class );

		$this->instance = new Keyphrase_Analysis( $this->options );
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
		$this->assertSame( 'keyphraseAnalysis', $this->instance->get_name() );
		$this->assertSame( 'keywordAnalysisActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 * @covers ::is_user_enabled
	 * @covers ::is_globally_enabled
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $keyphrase_analysis_active If the `keyphrase_analysis_active` option is enabled.
	 * @param bool $author_meta               If the `wpseo_keyword_analysis_disable` option is disabled for the current user.
	 * @param bool $expected                  The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled( bool $keyphrase_analysis_active, bool $author_meta, bool $expected ): void {
		$this->options
			->expects( 'get' )
			->with( 'keyword_analysis_active', true )
			->andReturn( $keyphrase_analysis_active );

		Monkey\Functions\expect( 'get_current_user_id' )
			->andReturn( 1 );
		Monkey\Functions\expect( 'get_user_meta' )
			->with( 1, 'wpseo_keyword_analysis_disable', true )
			->andReturn( $author_meta );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool>>
	 */
	public static function data_provider_is_enabled(): array {
		return [
			'Is globally enabled but not user enabled' => [
				'keyphrase_analysis_active' => true,
				'author_meta'               => false,
				'expected'                  => true,
			],
			'Is user enabled but not globally enabled' => [
				'keyphrase_analysis_active' => false,
				'author_meta'               => false,
				'expected'                  => false,
			],
			'Is disabled'                              => [
				'keyphrase_analysis_active' => false,
				'author_meta'               => false,
				'expected'                  => false,
			],
		];
	}
}
