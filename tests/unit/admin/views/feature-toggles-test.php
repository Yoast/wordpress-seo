<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Views;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Feature_Toggle;
use Yoast_Feature_Toggles;

/**
 * Unit Test Class.
 *
 * @covers \Yoast_Feature_Toggles
 */
class Yoast_Feature_Toggles_Test extends TestCase {

	/**
	 * Limited data copy of the `$feature_toggles` array from the `Yoast_Feature_Toggles::load_toggles() method.
	 *
	 * @var array
	 */
	protected $expected_feature_toggles = [
		0 => [
			'name'          => 'SEO analysis',
			'has_read_more' => true,
			'has_after'     => false,
		],
		1 => [
			'name'          => 'Readability analysis',
			'has_read_more' => true,
			'has_after'     => false,
		],
		2 => [
			'name'          => 'Cornerstone content',
			'has_read_more' => true,
			'has_after'     => false,
		],
		3 => [
			'name'          => 'Text link counter',
			'has_read_more' => true,
			'has_after'     => false,
		],
		4 => [
			'name'          => 'Insights',
			'has_read_more' => true,
			'has_after'     => false,
		],
		5 => [
			'name'          => 'Link suggestions',
			'has_read_more' => true,
			'has_after'     => false,
		],
		6 => [
			'name'          => 'XML sitemaps',
			'has_read_more' => true,
			'has_after'     => true,
		],
		7 => [
			'name'          => 'Admin bar menu',
			'has_read_more' => false,
			'has_after'     => false,
		],
		8 => [
			'name'          => 'Security: no advanced or schema settings for authors',
			'has_read_more' => false,
			'has_after'     => false,
		],
		9 => [
			'name'          => 'Usage tracking',
			'has_read_more' => true,
			'has_after'     => false,
		],
		10 => [
			'name'          => 'REST API: Head endpoint',
			'has_read_more' => false,
			'has_after'     => false,
		],
		11 => [
			'name'          => 'Enhanced Slack sharing',
			'has_read_more' => true,
			'has_after'     => false,
		],
		12 => [
			'name'          => 'Print QR code',
			'has_read_more' => true,
			'has_after'     => false,
		],
	];

	/**
	 * Test the basic functionality of the Yoast_Feature_Toggles class.
	 *
	 * @return void
	 */
	public function test_feature_toggles() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Functions\expect( 'add_query_arg' )->andReturn( '' );
		Functions\expect( 'wp_enqueue_style' )->andReturn( '' );
		Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );

		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		$instance = new Yoast_Feature_Toggles();
		$result   = $instance->get_all();

		// Verify the final result.
		foreach ( $result as $key => $toggle ) {
			$this->assertInstanceOf( Yoast_Feature_Toggle::class, $toggle );

			$actual_name = $toggle->name;
			$this->assertSame( $this->expected_feature_toggles[ $key ]['name'], $actual_name );

			if ( $this->expected_feature_toggles[ $key ]['has_read_more'] === true ) {
				$this->assertNotEmpty( $toggle->read_more_url, 'Read more URL is empty for ' . $actual_name );
			}
			else {
				$this->assertEmpty( $toggle->read_more_url, 'Read more URL is not empty for ' . $actual_name );
			}

			if ( $this->expected_feature_toggles[ $key ]['has_after'] === true ) {
				$this->assertNotEmpty( $toggle->after, 'After is empty for ' . $actual_name );
			}
			else {
				$this->assertEmpty( $toggle->after, 'After is not empty for ' . $actual_name );
			}
		}
	}

	/**
	 * Test that the sorting of the feature toggles works as expected.
	 *
	 * @link https://yoast.atlassian.net/browse/QAK-2609
	 *
	 * @return void
	 */
	public function test_toggle_sorting() {
		$expected_names = [
			0  => 'Admin bar menu',
			1  => 'Readability analysis',
			2  => 'Security: no advanced or schema settings for authors',
			3  => 'Text link counter',
			4  => 'Insights',
			5  => 'Link suggestions',
			6  => 'SEO analysis',
			7  => 'XML sitemaps',
			8  => 'Cornerstone content',
			9  => 'Usage tracking',
			10 => 'REST API: Head endpoint',
			11 => 'Enhanced Slack sharing',
			12 => 'Print QR code',
		];

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		Functions\expect( 'add_query_arg' )->andReturn( '' );
		Functions\expect( 'wp_enqueue_style' )->andReturn( '' );
		Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'is_premium' )->once()->andReturn( false );

		$helpers_mock = (object) [ 'product' => $product_helper_mock ];
		Functions\expect( 'YoastSEO' )->once()->andReturn( (object) [ 'helpers' => $helpers_mock ] );

		Filters\expectApplied( 'wpseo_feature_toggles' )
			->once()
			->andReturnUsing( [ $this, 'toggle_filter_callback' ] );

		$instance = new Yoast_Feature_Toggles();
		$result   = $instance->get_all();

		foreach ( $result as $key => $toggle ) {
			$this->assertInstanceOf( Yoast_Feature_Toggle::class, $toggle );
			$this->assertSame( $expected_names[ $key ], $toggle->name );
		}
	}

	/**
	 * Add two dummy toggles with out of order "order" values.
	 *
	 * @param array $toggles Current array with integration toggle objects where each object
	 *                       should have a `name`, `setting` and `label` property.
	 *
	 * @return Adjusted array with integration toggle objects.
	 */
	public function toggle_filter_callback( $toggles ) {
		$toggles[0]->order = 50;
		$toggles[2]->order = 92;
		$toggles[7]->order = 0;
		$toggles[8]->order = 25;

		return $toggles;
	}
}
