<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin\Views;

use Brain\Monkey\Filters;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast_Feature_Toggle;
use Yoast_Integration_Toggles;

/**
 * Unit Test Class.
 *
 * @covers \Yoast_Integration_Toggles
 */
class Yoast_Integration_Toggles_Test extends TestCase {

	/**
	 * Test the basic functionality of the Yoast_Integration_Toggles class.
	 *
	 * @return void
	 */
	public function test_integration_toggles() {
		$expected_names = [
			0 => 'Semrush integration',
			1 => 'Wincher integration',
			2 => 'Ryte integration',
			3 => 'Zapier integration',
			4 => 'Algolia integration',
		];

		$this->stubTranslationFunctions();

		$instance = new Yoast_Integration_Toggles();
		$result   = $instance->get_all();

		// Verify the final result.
		foreach ( $result as $key => $toggle ) {
			$this->assertInstanceOf( Yoast_Feature_Toggle::class, $toggle );
			$this->assertSame( $expected_names[ $key ], $toggle->name );
		}

		$this->assertEmpty( $result[0]->read_more_url );
		$this->assertNotEmpty( $result[2]->read_more_url );
	}

	/**
	 * Test that the sorting of the integration toggles works as expected when more items are added.
	 *
	 * @link https://yoast.atlassian.net/browse/QAK-2609
	 *
	 * @return void
	 */
	public function test_toggle_sorting() {
		$expected_names = [
			0 => 'Dummy prio 5',
			1 => 'Semrush integration',
			2 => 'Wincher integration',
			3 => 'Ryte integration',
			4 => 'Zapier integration',
			5 => 'Algolia integration',
			6 => 'Dummy prio 50',
		];

		$this->stubTranslationFunctions();

		Filters\expectApplied( 'wpseo_integration_toggles' )
			->once()
			->andReturnUsing( [ $this, 'toggle_filter_callback' ] );

		$instance = new Yoast_Integration_Toggles();
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
		$toggles[] = (object) [
			'name'    => 'Dummy prio 50',
			'setting' => 'dummy_50',
			'label'   => 'Dummy prio 50',
			'order'   => 50,
		];
		$toggles[] = (object) [
			'name'    => 'Dummy prio 5',
			'setting' => 'dummy_5',
			'label'   => 'Dummy prio 5',
			'order'   => 5,
		];

		return $toggles;
	}
}
