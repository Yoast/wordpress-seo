<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Admin
 */

namespace Yoast\WP\SEO\Tests\Integrations\Admin;

use Mockery;
use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Actions\Indexation\Indexable_General_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_And_Dashboard_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\TestCase;

use Yoast\WP\SEO\Integrations\Admin\Indexation_Integration;

/**
 * Class Indexation_Integration_Test
 *
 * @group actions
 * @group indexables
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
	 * @inheritDoc
	 */
	public function setUp() {
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->options                      = Mockery::mock( Options_Helper::class );
		$this->asset_manager                = Mockery::mock( WPSEO_Admin_Asset_Manager::class );

		$this->instance = new Indexation_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->options,
			$this->asset_manager
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
		$this->assertEquals( [
			Admin_Conditional::class,
			Yoast_Admin_And_Dashboard_Conditional::class
		], $conditionals );
	}

	/**
	 * Tests that the right hooks are registered when the indexation
	 * warning is not ignored.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_warning_is_not_ignored() {
		// Warning is not ignored.
		$this->options
			->expects( 'get' )
			->with( 'ignore_indexation_warning', false )
			->andReturn( false );

		// The admin_enqueue_scripts should be hooked into.
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that no hooks are registered when the warning is ignored.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_warning_is_ignored() {
		// Warning is ignored.
		$this->options->expects( 'get' )
		              ->with( 'ignore_indexation_warning', false )
		              ->andReturn( true );

		// The scripts and/or styles should not be enqueued.
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' )->never();

		$this->instance->register_hooks();
	}

	/**
	 * Tests that scripts and styles are enqueued and the modal
	 * is rendered when there is something to index.
	 *
	 * @covers ::enqueue_scripts
	 */
	public function test_enqueue_scripts() {
		// Mock that 40 indexables should be indexed.
		$this->set_total_unindexed_expectations(
			[
				'post_type_archive' => 5,
				'general'           => 10,
				'post'              => 15,
				'term'              => 10,
			]
		);

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
		Monkey\Actions\expectAdded( 'admin_notices' );

		// Mock retrieval of the REST URL.
		Monkey\Functions\expect( 'rest_url' )
			->once()
			->andReturn( 'https://example.org/wp-ajax/' );

		// Mock WP nonce.
		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->andReturn( 'nonce' );

		$expected_data = [
			'amount'  => 40,
			'ids'     => [
				'count'    => '#yoast-indexation-current-count',
				'progress' => '#yoast-indexation-progress-bar',
			],
			'restApi' => [
				'root'      => 'https://example.org/wp-ajax/',
				'endpoints' =>
					[
						'posts'    => 'yoast/v1/indexation/posts',
						'terms'    => 'yoast/v1/indexation/terms',
						'archives' => 'yoast/v1/indexation/post-type-archives',
						'general'  => 'yoast/v1/indexation/general',
					],
				'nonce'     => 'nonce',
			],
			'message' => [
				'indexingCompleted' => '<span class="wpseo-checkmark-ok-icon"></span>Good job! All your site\'s content has been indexed.',
				'indexingFailed'    => 'Something went wrong indexing the content of your site. Please try again later.',
			],
			'l10n'    => [
				'calculationInProgress' => 'Calculation in progress...',
				'calculationCompleted'  => 'Calculation completed.',
				'calculationFailed'     => 'Calculation failed, please try again later.',
			],
		];

		// The script should be localized with the right data.
		Monkey\Functions\expect( 'wp_localize_script' )
			->with(
				WPSEO_Admin_Asset_Manager::PREFIX . 'indexation',
				'yoastIndexationData',
				$expected_data
			);

		$this->instance->enqueue_scripts();
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

		$this->expectOutputString( '<div id="yoast-indexation-warning" class="notice notice-warning"><p><strong>NEW:</strong> Yoast SEO can speed up your website! Please <button type="button" id="yoast-open-indexation" class="button-link" data-title="Your content is being indexed">click here</button> to run our indexing process. Or <button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="nonce">dismiss this warning</button>.</p></div>' );

		$this->instance->render_indexation_warning();
	}

	/**
	 * Tests that the indexation modal is shown when its respective method is called.
	 *
	 * @covers ::render_indexation_modal
	 */
	public function test_render_indexation_modal() {
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

		$this->expectOutputString( '<div id="yoast-indexation-wrapper" class="hidden"><div><p>We\'re processing all of your content to speed it up! This may take a few minutes.</p><div id="yoast-indexation-progress-bar" class="wpseo-progressbar"></div><p>Object <span id="yoast-indexation-current-count">0</span> of <strong id="yoast-indexation-total-count">40</strong> processed.</p></div><button id="yoast-indexation-stop" type="button" class="button">Stop indexation</button></div>' );

		$this->instance->render_indexation_modal();
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
	 * @param array $total_unindexed_per_action Array mapping each indexable action to the number of unindexed objects of this type.
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
