<?php

namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework;


use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Editors\Framework\Content_Analysis;
use Yoast\WP\SEO\Editors\Framework\Inclusive_Language_Analysis;
use Yoast\WP\SEO\Editors\Framework\Keyword_Analysis;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Editors\Domain\Analysis_Features\Analysis_Feature;

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
	protected function set_up() {
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
	public function test_getters() {

		$this->assertSame( 'inclusiveLanguageAnalysis', $this->instance->get_name() );
		$this->assertSame( 'inclusiveLanguageAnalysisActive', $this->instance->get_legacy_key() );
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
	 * @param $inclusive_language_analysis_active bool If the `inclusive_language_analysis_active` option is enabled.
	 * @param $author_meta                        bool If the `wpseo_keyword_analysis_disable` option is disabled for the current user.
	 * @param $expected                           bool The expected outcome.
	 * @param $premium_version                           string The premium version.
	 * @param $has_inclusive_language_support                           bool If inclusive language support is there.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		$inclusive_language_analysis_active,
		$author_meta,
		$expected,
		$premium_version,
		$has_inclusive_language_support
	) {
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
		Monkey\Functions\expect( 'get_the_author_meta' )
			->with( 'wpseo_inclusive_language_analysis_disable', 1 )
			->andReturn( $author_meta );

		$this->assertSame( $expected, $this->instance->is_enabled() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array
	 */
	public static function data_provider_is_enabled() {
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

			'outdated premium'     => [
				'inclusive_language_analysis_active' => true,
				'author_meta'                        => false,
				'expected'                           => false,
				'premium_version'                    => '10',
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
