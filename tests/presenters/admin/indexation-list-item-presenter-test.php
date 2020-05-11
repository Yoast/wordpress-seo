<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters\Admin
 */

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter;
use Yoast\WP\SEO\Presenters\Admin\Migration_Error_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_List_Item_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter
 *
 * @group presenters
 */
class Indexation_List_Item_Presenter_Test extends TestCase {

	/**
	 * @covers ::__construct
	 */
	public function test_construct() {
		$instance = new Indexation_List_Item_Presenter( 12 );

		$this->assertAttributeSame( 12, 'total_unindexed', $instance );
	}

	/**
	 *
	 * Tests the case when there is nothing to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_nothing_to_index() {
		$instance = new Indexation_List_Item_Presenter( 0 );

		$expected  = '<li><strong>Speeding up your site</strong><br/>';
		$expected .= '<span class="wpseo-checkmark-ok-icon"></span>Great, your site has been optimized!';
		$expected .= '</li>';

		$this->assertSame( $expected, $instance->present() );
	}

	/**
	 * Tests the case when there is something to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_something_to_index() {
		$instance = new Indexation_List_Item_Presenter( 30 );

		$expected  = '<li><strong>Speeding up your site</strong><br/>';
		$expected .= '<span id="yoast-indexation"><button type="button" class="button yoast-open-indexation" data-title="Speeding up your site">';
		$expected .= 'Speed up your site';
		$expected .= '</button></span>';
		$expected .= '</li>';

		$this->assertSame( $expected, $instance->present() );
	}
}
