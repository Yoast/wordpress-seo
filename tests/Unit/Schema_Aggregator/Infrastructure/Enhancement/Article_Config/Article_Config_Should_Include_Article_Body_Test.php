<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;

use Brain\Monkey\Functions;
use Generator;

/**
 * Test class for the should_include_article_body method.
 *
 * @group Article_Config
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config::should_include_article_body
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Article_Config_Should_Include_Article_Body_Test extends Abstract_Article_Config_Test {

	/**
	 * Tests determining if articleBody should be included.
	 *
	 * @dataProvider should_include_article_body_data
	 *
	 * @param bool   $has_excerpt    Whether post has valid excerpt.
	 * @param string $filter_name    The filter name that should be called.
	 * @param bool   $default_value  The default value for the filter.
	 * @param bool   $filtered_value The value returned by the filter.
	 * @param bool   $expected       The expected result.
	 *
	 * @return void
	 */
	public function test_should_include_article_body( $has_excerpt, $filter_name, $default_value, $filtered_value, $expected ) {
		Functions\expect( 'apply_filters' )
			->once()
			->with( $filter_name, $default_value )
			->andReturn( $filtered_value );

		$this->assertEquals( $expected, $this->instance->should_include_article_body( $has_excerpt ) );
	}

	/**
	 * Data provider for the should_include_article_body test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function should_include_article_body_data() {
		yield 'Has excerpt, default false, not filtered' => [
			'has_excerpt'    => true,
			'filter_name'    => 'wpseo_article_enhance_body_when_excerpt_exists',
			'default_value'  => false,
			'filtered_value' => false,
			'expected'       => false,
		];
		yield 'Has excerpt, default false, filtered to true' => [
			'has_excerpt'    => true,
			'filter_name'    => 'wpseo_article_enhance_body_when_excerpt_exists',
			'default_value'  => false,
			'filtered_value' => true,
			'expected'       => true,
		];
		yield 'No excerpt, default true, not filtered' => [
			'has_excerpt'    => false,
			'filter_name'    => 'wpseo_article_enhance_article_body_fallback',
			'default_value'  => true,
			'filtered_value' => true,
			'expected'       => true,
		];
		yield 'No excerpt, default true, filtered to false' => [
			'has_excerpt'    => false,
			'filter_name'    => 'wpseo_article_enhance_article_body_fallback',
			'default_value'  => true,
			'filtered_value' => false,
			'expected'       => false,
		];
	}
}
