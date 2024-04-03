<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Inclusive_Language_Analysis_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis
 */
final class Inclusive_Language_Analysis_Test extends TestCase {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Holds the Language_Helper instance.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language;

	/**
	 * Holds the Product_Helper instance.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product;

	/**
	 * The Inclusive_Language_Analysis.
	 *
	 * @var Inclusive_Language_Analysis
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up(): void {
		parent::set_up();
		$this->options  = Mockery::mock( Options_Helper::class );
		$this->language = Mockery::mock( Language_Helper::class );
		$this->product  = Mockery::mock( Product_Helper::class );

		$this->instance = new Inclusive_Language_Analysis( $this->options, $this->language, $this->product );
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
		$this->assertSame( 'inclusiveLanguageAnalysis', $this->instance->get_name() );
		$this->assertSame( 'inclusiveLanguageAnalysisActive', $this->instance->get_legacy_key() );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @covers ::is_enabled
	 * @covers ::is_user_enabled
	 * @covers ::is_globally_enabled
	 * @covers ::is_current_version_supported
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool   $inclusive_language_analysis_active If the `inclusive_language_analysis_active` option is enabled.
	 * @param bool   $author_meta                        If the `wpseo_keyword_analysis_disable` option is disabled for the current user.
	 * @param bool   $expected                           The expected outcome.
	 * @param string $premium_version                    The premium version.
	 * @param bool   $has_inclusive_language_support     If inclusive language support is there.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		bool $inclusive_language_analysis_active,
		bool $author_meta,
		bool $expected,
		string $premium_version,
		bool $has_inclusive_language_support
	): void {
		$this->options
			->expects( 'get' )
			->with( 'inclusive_language_analysis_active', false )
			->andReturn( $inclusive_language_analysis_active );

		if ( $inclusive_language_analysis_active && ! $author_meta ) {
			$this->product
				->expects( 'is_premium' )
				->andReturn( true );

			$this->product
				->expects( 'get_premium_version' )
				->andReturn( $premium_version );
		}

		if ( $inclusive_language_analysis_active && ! $author_meta && $premium_version !== '10' ) {
			$this->language
				->expects( 'get_language' )
				->andReturn( 'something' );

			$this->language
				->expects( 'has_inclusive_language_support' )
				->andReturn( $has_inclusive_language_support );
		}

		Monkey\Functions\expect( 'get_current_user_id' )
			->andReturn( 1 );
		Monkey\Functions\expect( 'get_user_meta' )
			->with( 1, 'wpseo_inclusive_language_analysis_disable', true )
			->andReturn( $author_meta );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string|bool,string>>
	 */
	public static function data_provider_is_enabled(): array {
		return [
			'Is globally enabled'                       => [
				'inclusive_language_analysis_active' => true,
				'author_meta'                        => false,
				'expected'                           => true,

				'premium_version'                    => '20',
				'has_inclusive_language_support'     => true,
			],
			'Is user disabled but not globally enabled' => [
				'inclusive_language_analysis_active' => false,
				'author_meta'                        => true,
				'expected'                           => false,
				'premium_version'                    => '20',
				'has_inclusive_language_support'     => true,
			],
			'Is disabled'                               => [
				'inclusive_language_analysis_active' => false,
				'author_meta'                        => false,
				'expected'                           => false,
				'premium_version'                    => '20',
				'has_inclusive_language_support'     => true,
			],
			'outdated premium' => [
				'inclusive_language_analysis_active' => true,
				'author_meta'                        => false,
				'expected'                           => false,
				'premium_version'                    => '10',
				'has_inclusive_language_support'     => false,
			],
			'19.2 premium' => [
				'inclusive_language_analysis_active' => true,
				'author_meta'                        => false,
				'expected'                           => true,
				'premium_version'                    => '19.2',
				'has_inclusive_language_support'     => true,
			],
			'unsupported language' => [
				'inclusive_language_analysis_active' => true,
				'author_meta'                        => false,
				'expected'                           => false,
				'premium_version'                    => '20',
				'has_inclusive_language_support'     => false,
			],
		];
	}
}
