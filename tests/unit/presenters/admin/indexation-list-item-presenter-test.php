<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Monkey\Functions\stubs;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
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
	 * The indexable helper.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper The indexable helper.
	 */
	protected $indexable_helper;

	/**
	 * The class under test.
	 *
	 * @var Indexation_List_Item_Presenter The Indexation_List_Item_Presenter being tested.
	 */
	protected $instance;

	/**
	 * Provides a working test class.
	 *
	 * @param int $count The total unindexed count.
	 */
	public function default_arrange( $count ) {
		$this->instance = new Indexation_List_Item_Presenter( $count, $this->indexable_helper );
	}

	/**
	 * Initializes requirements for all tests.
	 *
	 * @phpcs ignore
	 */
	public function setup() {
		parent::setUp();

		$this->indexable_helper = \Mockery::Mock( Indexable_Helper::class );
		$this->default_arrange( 0 );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );
		Monkey\Functions\expect( 'get_platform_version' )->andReturn( '5.5' );

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride
		if ( ! isset( $GLOBALS['wp_version'] ) ) {
			// phpcs:ignore WordPress.WP.GlobalVariablesOverride
			$GLOBALS['wp_version'] = 5.5;
		}
		if ( ! defined( 'WPSEO_VERSION' ) ) {
			define( 'WPSEO_VERSION', 15.0 );
		}
		if ( ! defined( 'DAY_IN_SECONDS' ) ) {
			define( 'DAY_IN_SECONDS', ( 60 * 60 * 24 ) );
		}
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->default_arrange( 12 );

		$this->assertAttributeSame( 12, 'total_unindexed', $this->instance );
		$this->assertAttributeInstanceOf( Indexable_Helper::class, 'indexable_helper', $this->instance );
	}

	/**
	 * Tests the case when there is nothing to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_nothing_to_index() {
		// Arrange.
		$this->default_arrange( 0 );

		// Act.
		$result = $this->instance->present();

		// Assert.
		$expected  = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>.';
		$expected .= ' To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<span class="wpseo-checkmark-ok-icon"></span>Great, your site has been optimized!';
		$expected .= '</li>';

		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests the case when there is something to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_something_to_index_non_production() {
		// Arrange.
		$this->default_arrange( 30 );
		$this->indexable_helper->shouldReceive( 'should_index_indexables' )->andReturn( false );

		// Act.
		$result = $this->instance->present();

		// Assert.
		$expected  = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>. ';
		$expected .= 'To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<span id="yoast-indexation"><button type="button" class="button yoast-open-indexation" data-title="Speeding up your site" data-settings="yoastIndexationData" disabled>Start processing and speed up your site now</button></span>';
		$expected .= '<p>This button to index your website is disabled for non-production environments.</p>';
		$expected .= '</li>';

		$this->assertSame( $expected, $result );
	}

	/**
	 * Tests the case when there is something to index.
	 *
	 * @covers ::present
	 */
	public function test_present_with_something_to_index_production() {
		// Arrange.
		$this->default_arrange( 30 );
		$this->indexable_helper->shouldReceive( 'should_index_indexables' )->andReturn( true );

		// Act.
		$result = $this->instance->present();

		// Assert.
		$expected  = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>. ';
		$expected .= 'To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<span id="yoast-indexation"><button type="button" class="button yoast-open-indexation" data-title="Speeding up your site" data-settings="yoastIndexationData" >Start processing and speed up your site now</button></span>';
		$expected .= '</li>';

		$this->assertSame( $expected, $result );
	}
}
