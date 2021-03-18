<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Integrations\Schema_Blocks;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Blocks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Schema_Blocks
 *
 * @group integrations
 * @group schema
 */
class Schema_Blocks_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Schema_Blocks
	 */
	protected $instance;

	/**
	 * Represents the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * The ID helper.
	 *
	 * @var Mockery\MockInterface|ID_Helper
	 */
	protected $id_helper;

	/**
	 * The Schema blocks conditional.
	 *
	 * @var Mockery\MockInterface|Schema_Blocks_Conditional
	 */
	protected $blocks_conditional;

	/**
	 * Runs the setup to prepare the needed instance.
	 */
	public function set_up() {
		parent::set_up();

		$this->asset_manager      = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->blocks_conditional = Mockery::mock( Schema_Blocks_Conditional::class );

		$this->instance = new Schema_Blocks(
			$this->asset_manager,
			$this->blocks_conditional
		);
	}

	/**
	 * Tests the constructor by checking the set attributes.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		static::assertInstanceOf( WPSEO_Admin_Asset_Manager::class, self::getPropertyValue( $this, 'asset_manager' ) );
		static::assertInstanceOf( Schema_Blocks_Conditional::class, self::getPropertyValue( $this, 'blocks_conditional' ) );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertSame( [ Schema_Blocks_Conditional::class ], Schema_Blocks::get_conditionals() );
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		Monkey\Actions\has( 'enqueue_block_editor_assets', [ $this->instance, 'load' ] );
		Monkey\Actions\has( 'wpseo_json_ld', [ $this->instance, 'register_replace_vars' ] );
	}

	/**
	 * Tests the register_template with a template not starting with a slash.
	 *
	 * @covers ::register_template
	 */
	public function test_register_template_not_starting_with_slash() {
		$this->instance->register_template( 'template.php' );

		static::assertEquals(
			[ WPSEO_PATH . '/template.php' ],
			$this->getPropertyValue( $this->instance, 'templates' )
		);
	}

	/**
	 * Tests the register_template with a template that starts with a slash.
	 *
	 * @covers ::register_template
	 */
	public function test_register_template() {
		$this->instance->register_template( '/template.php' );

		static::assertEquals(
			[ '/template.php' ],
			$this->getPropertyValue( $this->instance, 'templates' )
		);
	}

	/**
	 * Tests the loading of all schema block templates.
	 *
	 * @covers ::load
	 */
	public function test_load() {
		$this->asset_manager
			->expects( 'enqueue_script' )
			->with( 'schema-blocks' )
			->once();

		$this->asset_manager
			->expects( 'enqueue_style' )
			->with( 'schema-blocks' )
			->once();

		$this->instance->load();
	}

	/**
	 * Tests the outputting of a template.
	 *
	 * @covers ::output
	 */
	public function test_output() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();

		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		$this->instance->register_template( 'src/schema-templates/recipe.block.php' );
		$this->instance->output();

		$this->expectOutputContains( '<script type="text/block-template">' );
	}

	/**
	 * Tests the outputting of a template when the feature flag is
	 * not enabled.
	 *
	 * @covers ::output
	 */
	public function test_output_feature_flag_not_enabled() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();

		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnFalse();

		$this->instance->register_template( 'src/schema-templates/recipe.block.php' );

		Monkey\Filters\expectApplied( 'wpseo_load_schema_templates' )
			->andReturn( [ WPSEO_PATH . '/src/schema-templates/recipe.block.php' ] );

		$this->instance->output();

		$this->expectOutputContains( '<script type="text/block-template">' );
	}

	/**
	 * Tests the outputting of the templates without having the needed scripts enqueued.
	 *
	 * @covers ::output
	 */
	public function test_output_with_scripts_not_enqueued() {
		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnFalse();

		$this->instance->output();

		$this->expectOutputString( '' );
	}

	/**
	 * Tests the loading of schema block templates by using the filter.
	 *
	 * @covers ::output
	 */
	public function test_load_with_filter() {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();

		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		// First add a template.
		Monkey\Filters\expectApplied( 'wpseo_load_schema_templates' )
			->andReturn( [ WPSEO_PATH . '/src/schema-templates/recipe.block.php' ] );

		$this->instance->output();

		$this->expectOutputContains( '<script type="text/block-template">' );
	}

	/**
	 * Tests the loading of schema block templates by using the filter that returns a faulty value.
	 *
	 * @covers ::output
	 */
	public function test_load_with_filter_returning_faulty_value() {
		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();


		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		// First add a template.
		Monkey\Filters\expectApplied( 'wpseo_load_schema_templates' )
			->andReturnFalse();

		$this->instance->output();

		$this->expectOutputString( '' );
	}

	/**
	 * Tests the outputting of a schema block template that doesn't exists.
	 *
	 * @covers ::output
	 */
	public function test_output_with_non_existing_template() {
		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();

		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		$this->instance->register_template( WPSEO_PATH . '/src/schema-templates/nonexisting.block.php' );

		$this->instance->output();

		$this->expectOutputString( '' );
	}

	/**
	 * Tests the outputting of schema block templates with no templates being set.
	 *
	 * @covers ::output
	 */
	public function test_output_with_having_no_templates_set() {
		$this->asset_manager
			->expects( 'is_script_enqueued' )
			->with( 'schema-blocks' )
			->once()
			->andReturnTrue();

		$this->blocks_conditional
			->expects( 'is_met' )
			->andReturnTrue();

		Monkey\Filters\expectApplied( 'wpseo_load_schema_templates' );

		$this->instance->output();

		$this->expectOutputString( '' );
	}
}
