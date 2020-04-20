<?php

namespace Yoast\WP\SEO\Tests\Integrations\Admin;

use Mockery;
use Brain\Monkey;
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
	 * @inheritDoc
	 */
	public function setUp() {
		$this->post_type_archive_indexation = Mockery::mock( Indexable_Post_Type_Archive_Indexation_Action::class );
		$this->post_indexation              = Mockery::mock( Indexable_Post_Indexation_Action::class );
		$this->term_indexation              = Mockery::mock( Indexable_Term_Indexation_Action::class );
		$this->general_indexation           = Mockery::mock( Indexable_General_Indexation_Action::class );
		$this->options                      = Mockery::mock( Options_Helper::class );

		$this->instance = new Indexation_Integration(
			$this->post_indexation,
			$this->term_indexation,
			$this->post_type_archive_indexation,
			$this->general_indexation,
			$this->options
		);
	}

	/**
	 * Tests that the indexation is only loaded when:
	 *  - on a Yoast page in the admin.
	 *  - on the plugin page.
	 *  - on the dashboard.
	 *  - on the WordPress upgrade page.
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
	 * Tests that the necessary scripts and styles are loaded
	 * when the warning should be shown on screen.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks_when_warning_is_not_ignored() {
		// Warning is not ignored.
		$this->options->expects( 'get' )
		              ->with( 'ignore_indexation_warning', false )
		              ->andReturn( false );

		// The scripts and/or styles should be enqueued.
		Monkey\Actions\expectAdded( 'admin_enqueue_scripts' );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that the necessary scripts and styles are loaded
	 * when the warning should be shown on screen.
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
	 * Tests that the object gets the right properties when constructed.
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
