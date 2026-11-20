<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Llms_Txt\Application\File\Commands\Populate_File;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Remove_File_Command_Handler;
use Yoast\WP\SEO\Llms_Txt\Application\File\Llms_Txt_Cron_Scheduler;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Description_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Intro_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Link_Lists_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Optional_Link_List_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Title_Builder;
use Yoast\WP\SEO\Llms_Txt\Application\Markdown_Escaper;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Description;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Intro;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Link_List;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Sections\Title;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_File_System_Adapter;
use Yoast\WP\SEO\Llms_Txt\Infrastructure\File\WordPress_Llms_Txt_Permission_Gate;
use Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests that the llms.txt is not duplicated when the population is triggered more than once.
 *
 * A population can start while another population is still running: when the manual post collection prunes
 * an invalid manually selected page, the resulting write to the llms.txt options triggers the option watcher.
 * Two settings can also be saved in a single request, leading to two populations in that request.
 *
 * @group llms.txt
 *
 * @covers Yoast\WP\SEO\Llms_Txt\Application\File\Commands\Populate_File_Command_Handler::handle
 * @covers Yoast\WP\SEO\Llms_Txt\Application\Markdown_Builders\Markdown_Builder::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::add_section
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::get_sections
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::render
 * @covers Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Llms_Txt_Renderer::reset
 * @covers Yoast\WP\SEO\Llms_Txt\User_Interface\Enable_Llms_Txt_Option_Watcher::check_llms_txt_selection
 */
final class Handle_Repeated_Population_Test extends TestCase {

	/**
	 * The content that was last written to the llms.txt file.
	 *
	 * @var string
	 */
	private $written_content = '';

	/**
	 * The instance under test.
	 *
	 * @var Populate_File_Command_Handler
	 */
	private $instance;

	/**
	 * The option watcher that starts a new population when the llms.txt options change.
	 *
	 * @var Enable_Llms_Txt_Option_Watcher
	 */
	private $watcher;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		Monkey\Functions\stubs(
			[
				'update_option' => null,
				'delete_option' => null,
			],
		);

		Monkey\Functions\expect( 'apply_filters' )
			->with( 'wpseo_llmstxt_encoding_prefix', "\xEF\xBB\xBF" )
			->zeroOrMoreTimes()
			->andReturn( "\xEF\xBB\xBF" );
	}

	/**
	 * Tests that a population started during a population does not duplicate the llms.txt content.
	 *
	 * @return void
	 */
	public function test_population_during_population_does_not_duplicate_the_content() {
		$baseline = $this->get_baseline_content();
		$handler  = $this->create_handler( true );

		$handler->handle();

		$this->assertSame( $baseline, $this->written_content );
		$this->assert_sections_occur_once( $this->written_content );
	}

	/**
	 * Tests that two populations in the same request do not accumulate their content.
	 *
	 * @return void
	 */
	public function test_repeated_population_does_not_duplicate_the_content() {
		$baseline = $this->get_baseline_content();
		$handler  = $this->create_handler( false );

		$handler->handle();
		$handler->handle();

		$this->assertSame( $baseline, $this->written_content );
		$this->assert_sections_occur_once( $this->written_content );
	}

	/**
	 * Creates the command handler and the option watcher.
	 *
	 * @param bool $change_option_while_rendering Whether the llms.txt options change while the markdown is rendered.
	 *
	 * @return Populate_File_Command_Handler The command handler.
	 */
	private function create_handler( bool $change_option_while_rendering ): Populate_File_Command_Handler {
		$options_helper = Mockery::mock( Options_Helper::class );
		$options_helper->expects( 'get' )->with( 'enable_llms_txt', false )->zeroOrMoreTimes()->andReturn( true );

		$permission_gate = Mockery::mock( WordPress_Llms_Txt_Permission_Gate::class );
		$permission_gate->expects( 'is_managed_by_yoast_seo' )->zeroOrMoreTimes()->andReturn( true );

		$file_system_adapter = Mockery::mock( WordPress_File_System_Adapter::class );
		$file_system_adapter->expects( 'set_file_content' )->zeroOrMoreTimes()->andReturnUsing(
			function ( $content ) {
				$this->written_content = $content;

				return true;
			},
		);

		$changed            = false;
		$link_lists_builder = Mockery::mock( Link_Lists_Builder::class );
		$link_lists_builder->expects( 'build_link_lists' )->zeroOrMoreTimes()->andReturnUsing(
			function () use ( &$changed, $change_option_while_rendering ) {
				if ( $change_option_while_rendering && $changed === false ) {
					$changed = true;
					// Simulates the manual post collection storing a selection with an invalid page in it.
					$this->watcher->check_llms_txt_selection(
						[ 'other_included_pages' => [ 11, 12 ] ],
						[ 'other_included_pages' => [ 12 ] ],
					);
				}

				return self::create_link_lists();
			},
		);

		$this->instance = new Populate_File_Command_Handler(
			$options_helper,
			$file_system_adapter,
			$this->create_markdown_builder( $link_lists_builder ),
			$permission_gate,
		);

		$this->watcher = new Enable_Llms_Txt_Option_Watcher(
			Mockery::mock( Llms_Txt_Cron_Scheduler::class ),
			Mockery::mock( Remove_File_Command_Handler::class ),
			$this->instance,
			$options_helper,
		);

		return $this->instance;
	}

	/**
	 * Creates the baseline content: the content of a single population that is not interrupted.
	 *
	 * @return string The baseline content.
	 */
	private function get_baseline_content(): string {
		$link_lists_builder = Mockery::mock( Link_Lists_Builder::class );
		$link_lists_builder->expects( 'build_link_lists' )->zeroOrMoreTimes()->andReturnUsing(
			static function () {
				return self::create_link_lists();
			},
		);

		return "\xEF\xBB\xBF" . $this->create_markdown_builder( $link_lists_builder )->render();
	}

	/**
	 * Asserts that each section of the llms.txt occurs exactly once.
	 *
	 * @param string $content The content of the llms.txt.
	 *
	 * @return void
	 */
	private function assert_sections_occur_once( string $content ) {
		$this->assertSame( 1, \substr_count( $content, '# Example site: Example tagline' ), 'The title section occurs more than once.' );
		$this->assertSame( 1, \substr_count( $content, '> Description of the site' ), 'The description section occurs more than once.' );
		$this->assertSame( 1, \substr_count( $content, 'Generated by Yoast SEO' ), 'The intro section occurs more than once.' );
		$this->assertSame( 1, \substr_count( $content, '## Pages' ), 'The pages link list occurs more than once.' );
		$this->assertSame( 1, \substr_count( $content, '## Categories' ), 'The categories link list occurs more than once.' );
		$this->assertSame( 1, \substr_count( $content, '## Optional' ), 'The optional link list occurs more than once.' );
	}

	/**
	 * Creates a markdown builder that uses the real renderer and the real escaper.
	 *
	 * @param Link_Lists_Builder $link_lists_builder The link lists builder to use.
	 *
	 * @return Markdown_Builder The markdown builder.
	 */
	private function create_markdown_builder( Link_Lists_Builder $link_lists_builder ): Markdown_Builder {
		$title_builder = Mockery::mock( Title_Builder::class );
		$title_builder->expects( 'build_title' )->zeroOrMoreTimes()->andReturnUsing(
			static function () {
				return new Title( 'Example site', 'Example tagline' );
			},
		);

		$description_builder = Mockery::mock( Description_Builder::class );
		$description_builder->expects( 'build_description' )->zeroOrMoreTimes()->andReturnUsing(
			static function () {
				return new Description( 'Description of the site.' );
			},
		);

		$intro_builder = Mockery::mock( Intro_Builder::class );
		$intro_builder->expects( 'build_intro' )->zeroOrMoreTimes()->andReturnUsing(
			static function () {
				return new Intro( 'Generated by Yoast SEO v1.0, this is an llms.txt file, meant for consumption by LLMs.', [] );
			},
		);

		$optional_link_list_builder = Mockery::mock( Optional_Link_List_Builder::class );
		$optional_link_list_builder->expects( 'build_optional_link_list' )->zeroOrMoreTimes()->andReturnUsing(
			static function () {
				return new Link_List( 'Optional', [ new Link( 'Sitemap index', 'https://example.com/sitemap_index.xml' ) ] );
			},
		);

		return new Markdown_Builder(
			new Llms_Txt_Renderer(),
			$intro_builder,
			$title_builder,
			$description_builder,
			$link_lists_builder,
			new Markdown_Escaper(),
			$optional_link_list_builder,
		);
	}

	/**
	 * Creates the link lists for the content types and the taxonomies.
	 *
	 * @return Link_List[] The link lists.
	 */
	private static function create_link_lists(): array {
		return [
			new Link_List( 'Pages', [ new Link( 'Home', 'https://example.com/' ) ] ),
			new Link_List( 'Categories', [ new Link( 'News', 'https://example.com/category/news/' ) ] ),
		];
	}
}
