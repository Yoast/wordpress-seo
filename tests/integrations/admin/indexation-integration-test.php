<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Admin
 */

namespace Yoast\WP\SEO\Tests\Integrations\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Tools_Page_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexation_Integration;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexation_Integration_Test
 *
 * @group integrations
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Admin\Indexation_Integration
 */
class Indexation_Integration_Test extends TestCase {

	/**
	 * Holds indexation integration.
	 *
	 * @var Indexation_Integration
	 */
	private $instance;

	/**
	 * Holds the post indexation action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Indexation_Action
	 */
	private $post_indexation;

	/**
	 * Holds the term indexation action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Term_Indexation_Action
	 */
	private $term_indexation;

	/**
	 * Holds the post type archive indexation action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Post_Type_Archive_Indexation_Action
	 */
	private $post_type_archive_indexation;

	/**
	 * Holds the general indexation action mock.
	 *
	 * @var Mockery\MockInterface|Indexable_General_Indexation_Action
	 */
	private $general_indexation;

	/**
	 * Holds the options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Holds the admin asset manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Yoast tools page conditional.
	 *
	 * @var Mockery\MockInterface|Yoast_Tools_Page_Conditional
	 */
	private $yoast_tools_page_conditional;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->options                      = Mockery::mock( Options_Helper::class );
		$this->asset_manager                = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->yoast_tools_page_conditional = Mockery::mock( Yoast_Tools_Page_Conditional::class );

		$this->instance = new Indexation_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->options,
			$this->asset_manager,
			$this->yoast_tools_page_conditional
		);

		parent::setUp();
	}

	/**
	 * Tests that the get conditionals method returns
	 * the right conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$conditionals = Indexation_Integration::get_conditionals();
		$this->assertEquals(
			[
				Admin_Conditional::class,
				Yoast_Admin_And_Dashboard_Conditional::class,
				Migrations_Conditional::class,
			],
			$conditionals
		);
	}

	/**
	 * Tests the register hooks function.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );
		Monkey\Actions\expectAdded( 'wpseo_tools_overview_list_items' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that scripts and styles are enqueued and the modal
	 * is rendered when there is something to index.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts_not_having_warning_ignored() {
		// Mock that 40 indexables should be indexed.
		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

		$this->yoast_tools_page_conditional->expects( 'is_met' )
			->once()
			->andReturn( true );

		$this->options
			->expects( 'get' )
			->with( 'ignore_indexation_warning', false )
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->with( 'indexation_started', 0 )
			->andReturn( 0 );

		$this->options
			->expects( 'get' )
			->with( 'indexation_warning_hide_until' )
			->andReturn( 0 );

		$this->options
			->expects( 'get' )
			->once()
			->with( 'indexables_indexation_reason', '' )
			->andReturn( '' );

		Monkey\Actions\expectAdded( 'admin_notices' );

		// Expect that the script and style for the modal is enqueued.
		$this->asset_manager
			->expects( 'enqueue_script' )
			->once()
			->with( 'indexation' );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->once()
			->with( 'admin-css' );

		// We should hook into the admin footer and admin notices hook.
		Monkey\Actions\expectAdded( 'admin_footer' );

		// Mock retrieval of the REST URL.
		Monkey\Functions\expect( 'rest_url' )
			->once()
			->andReturn( 'https://example.org/wp-ajax/' );

		// Mock WP nonce.
		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->andReturn( 'nonce' );

		// The script should be localized with the right data.
		Monkey\Functions\expect( 'wp_localize_script' )
			->with(
				WPSEO_Admin_Asset_Manager::PREFIX . 'indexation',
				'yoastIndexationData',
				$this->get_localized_data()
			);

		$this->instance->enqueue_scripts();
	}

	/**
	 * Tests that scripts and styles are enqueued and the modal
	 * is rendered when there is something to index.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts_having_the_warning_ignored() {
		// Mock that 40 indexables should be indexed.
		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

		$this->options
			->expects( 'get' )
			->with( 'ignore_indexation_warning', false )
			->andReturnTrue();

		// Expect that the script and style for the modal is enqueued.
		$this->asset_manager
			->expects( 'enqueue_script' )
			->once()
			->with( 'indexation' );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->once()
			->with( 'admin-css' );

		$this->yoast_tools_page_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		// We should hook into the admin footer and admin notices hook.
		Monkey\Actions\expectAdded( 'admin_footer' );

		// Mock retrieval of the REST URL.
		Monkey\Functions\expect( 'rest_url' )
			->once()
			->andReturn( 'https://example.org/wp-ajax/' );

		// Mock WP nonce.
		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->andReturn( 'nonce' );

		// The script should be localized with the right data.
		Monkey\Functions\expect( 'wp_localize_script' )
			->with(
				WPSEO_Admin_Asset_Manager::PREFIX . 'indexation',
				'yoastIndexationData',
				$this->get_localized_data()
			);

		$this->instance->enqueue_scripts();
	}

	/**
	 * Returns the localized data.
	 *
	 * @return array The localized data.
	 */
	protected function get_localized_data() {
		return [
			'amount'  => 40,
			'ids'     => [
				'count'    => '#yoast-indexation-current-count',
				'progress' => '#yoast-indexation-progress-bar',
			],
			'restApi' => [
				'root'      => 'https://example.org/wp-ajax/',
				'endpoints' => [
					'prepare'  => 'yoast/v1/indexation/prepare',
					'posts'    => 'yoast/v1/indexation/posts',
					'terms'    => 'yoast/v1/indexation/terms',
					'archives' => 'yoast/v1/indexation/post-type-archives',
					'general'  => 'yoast/v1/indexation/general',
					'complete' => 'yoast/v1/indexation/complete',
				],
				'nonce'     => 'nonce',
			],
			'message' => [
				'indexingCompleted' => '<span class="wpseo-checkmark-ok-icon"></span>Good job! You\'ve sped up your site.',
				'indexingFailed'    => 'Something went wrong while optimizing the SEO data of your site. Please try again later.',
			],
			'l10n'    => [
				'calculationInProgress' => 'Optimization in progress...',
				'calculationCompleted'  => 'Optimization completed.',
				'calculationFailed'     => 'Optimization failed, please try again later.',
			],
		];
	}

	/**
	 * Tests that the modal and indexation assets are not enqueued when not on the Yoast tools page.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts_without_indexable_assets() {
		// Mock that 40 indexables should be indexed.
		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

		$this->yoast_tools_page_conditional->expects( 'is_met' )
			->once()
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->with( 'ignore_indexation_warning', false )
			->andReturnTrue();

		// Expect that the script and style for the modal is not enqueued.
		$this->asset_manager
			->expects( 'enqueue_script' )
			->never()
			->with( 'indexation' );

		$this->asset_manager
			->expects( 'enqueue_style' )
			->never()
			->with( 'admin-css' );

		$this->instance->enqueue_scripts();
	}

	/**
	 * Returns whether or not the warning is ignored.
	 *
	 * @return array The possible values.
	 */
	public function ignore_warning_provider() {
		return [
			[ true ],
			[ false ],
		];
	}

	/**
	 * Tests that scripts and styles are not enqueued when there is
	 * nothing to index.
	 *
	 * @covers ::enqueue_scripts
	 * @covers ::get_total_unindexed
	 */
	public function test_enqueue_scripts_when_nothing_should_be_indexed() {
		// Nothing should be indexed.
		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 0,
				'general'           => 0,
				'post'              => 0,
				'term'              => 0,
			]
		);

		$this->options
			->expects( 'set' )
			->once()
			->with( 'indexables_indexation_reason', '' );

		// The warning and modal should not be rendered.
		Monkey\Actions\expectAdded( 'admin_footer' )->never();
		Monkey\Actions\expectAdded( 'admin_notices' )->never();

		// The script should not be localized.
		Monkey\Functions\expect( 'wp_localize_script' )->never();

		$this->instance->enqueue_scripts();
	}

	/**
	 * Tests that the indexation warning is shown when its respective method is called.
	 *
	 * @covers ::render_indexation_warning
	 */
	public function test_render_indexation_warning() {
		// Mock WP nonce.
		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->andReturn( 'nonce' );

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->andReturn( true );

		$this->post_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->term_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->general_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );
		$this->post_type_archive_indexation->expects( 'get_total_unindexed' )->andReturn( 0 );

		$this->options->expects( 'get' )->with( 'indexation_started', 0 )->andReturn( 0 );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$expected = '<div id="yoast-indexation-warning" class="notice notice-success"><p>';
		$expected .= '<a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site.</a></p>';
		$expected .= '<p>To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<p>We estimate this will take less than a minute.</p>';
		$expected .= '<button type="button" class="button yoast-open-indexation" data-title="<strong>Yoast indexing status</strong>" data-settings="yoastIndexationData">Start processing and speed up your site now</button>';
		$expected .= '<hr /><p><button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="nonce">Hide this notice</button> (everything will continue to function normally)</p></div>';

		$this->expectOutputString( $expected );

		$this->instance->render_indexation_warning();
	}

	/**
	 * Tests that the indexation warning is shown when its respective method is called.
	 *
	 * @covers ::render_indexation_warning
	 */
	public function test_no_render_indexation_warning_non_admin() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->andReturn( false );

		$this->expectOutputString( '' );

		$this->instance->render_indexation_warning();
	}

	/**
	 * Tests that the indexation modal is shown when its respective method is called.
	 *
	 * @covers ::render_indexation_modal
	 */
	public function test_render_indexation_modal() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->andReturn( true );

		// Expect a thickbox to be added for the modal.
		Monkey\Functions\expect( 'add_thickbox' )
			->once();

		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

		$this->expectOutputString( '<div id="yoast-indexation-wrapper" class="hidden"><div><p>We\'re processing all of your content to speed it up! This may take a few minutes.</p><div id="yoast-indexation-progress-bar" class="wpseo-progressbar"></div><p>Object <span id="yoast-indexation-current-count">0</span> of <strong id="yoast-indexation-total-count">40</strong> processed.</p></div><button id="yoast-indexation-stop" type="button" class="yoast-button yoast-button--secondary">Stop indexing</button></div>' );

		$this->instance->render_indexation_modal();
	}

	/**
	 * Tests that the indexation list item is shown when its respective method is called.
	 *
	 * @covers ::render_indexation_list_item
	 */
	public function test_render_indexation_list_item() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->andReturn( true );

		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$expected = '<li><strong>SEO Data</strong>';
		$expected .= '<p><a href="" target="_blank">Yoast SEO creates and maintains an index of all of your site\'s SEO data in order to speed up your site</a>.';
		$expected .= ' To build your index, Yoast SEO needs to process all of your content.</p>';
		$expected .= '<span id="yoast-indexation"><button type="button" class="yoast-button yoast-button--secondary yoast-open-indexation" data-title="Speeding up your site" data-settings="yoastIndexationData">';
		$expected .= 'Start processing and speed up your site now</button></span></li>';

		$this->expectOutputString( $expected );

		$this->instance->render_indexation_list_item();
	}

	/**
	 * Tests that the `Indexation_Integration` object gets the right properties when constructed.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeSame( $this->post_indexation, 'post_indexation', $this->instance );
		$this->assertAttributeSame( $this->term_indexation, 'term_indexation', $this->instance );
		$this->assertAttributeSame( $this->post_type_archive_indexation, 'post_type_archive_indexation', $this->instance );
		$this->assertAttributeSame( $this->general_indexation, 'general_indexation', $this->instance );
		$this->assertAttributeSame( $this->options, 'options_helper', $this->instance );
	}

	/**
	 * Sets the expectations for the get_total_unindexed methods of the indexation actions.
	 *
	 * @param array $total_unindexed_per_action Array mapping each indexable action to the number of unindexed objects
	 *                                          of this type.
	 */
	private function set_total_unindexed_expectations( $total_unindexed_per_action ) {
		$this->post_type_archive_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( $total_unindexed_per_action['post_type_archive'] );

		$this->post_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( $total_unindexed_per_action['post'] );

		$this->term_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( $total_unindexed_per_action['term'] );

		$this->general_indexation
			->expects( 'get_total_unindexed' )
			->once()
			->andReturn( $total_unindexed_per_action['general'] );
	}
}
