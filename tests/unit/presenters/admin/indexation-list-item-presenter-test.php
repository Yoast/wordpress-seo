<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexation_List_Item_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Indexation_List_Item_Presenter
 *
 * @group presenters
 */
class Indexation_List_Item_Presenter_Test extends TestCase {

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$instance = new Indexation_List_Item_Presenter( 12 );

		$this->assertAttributeSame( 12, 'total_unindexed', $instance );
	}

	/**
	 * Tests the case when there is nothing to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_nothing_to_index() {
		$instance = new Indexation_List_Item_Presenter( 0 );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$expected  = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>.';
		$expected .= ' To build your index, Yoast SEO needs to process all of your content.</p>';
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

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$expected  = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>. ';
		$expected .= 'To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<span id="yoast-indexation"><button type="button" class="button yoast-open-indexation" data-title="Speeding up your site" data-settings="yoastIndexationData">Start processing and speed up your site now</button></span>';
		$expected .= '</li>';

		$this->assertSame( $expected, $instance->present() );
	}
}
