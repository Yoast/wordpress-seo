<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Schema_Blocks_Conditional;
use Yoast\WP\SEO\Integrations\Schema_Blocks;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Blocks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Schema_Blocks
 *
 * @group integrations
 * @group schema
 * @group test
 */
class Schema_Blocks_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Schema_Blocks
	 */
	protected $instance;

	public function setUp() {
		parent::setUp();

		$this->instance = new Schema_Blocks();
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertSame(
			[
				Schema_Blocks_Conditional::class
			],
			Schema_Blocks::get_conditionals()
		);
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		Monkey\Actions\has( 'enqueue_block_editor_assets', [ $this->instance, 'load' ] );
	}

	/**
	 * Tests the register_template with a template not starting with a slash.
	 *
	 * @covers ::register_template
	 */
	public function test_register_template_not_starting_with_slash() {
		$this->instance->register_template( 'template.php' );

		static::assertAttributeEquals(
			[ WPSEO_PATH . '/template.php' ],
			'templates',
			$this->instance
		);
	}

	/**
	 * Tests the register_template with a template that starts with a slash.
	 *
	 * @covers ::register_template
	 */
	public function test_register_template() {
		$this->instance->register_template( '/template.php' );

		static::assertAttributeEquals(
			[ '/template.php' ],
			'templates',
			$this->instance
		);
	}

	/**
	 * Tests the loading of all schema block templates.
	 */
	public function test_load() {
		$this->instance->register_template( WPSEO_PATH . '/src/schema-templates/recipe.block.php' );

		Monkey\Functions\expect( 'wp_enqueue_script' )->once();
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$this->instance->load();

		$this->expectOutputContains( '<script type="text/block-template">' );
	}

	/**
	 * Tests the loading of schema block templates by using the filter.
	 *
	 * @covers ::load
	 */
	public function test_load_with_filter() {
		// First add a template.
		Monkey\Filters\expectApplied( 'wpseo_schema_templates' )
			->andReturn( [ WPSEO_PATH . '/src/schema-templates/recipe.block.php' ] );

		Monkey\Functions\expect( 'wp_enqueue_script' )->once();
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$this->instance->load();

		$this->expectOutputContains( '<script type="text/block-template">' );
	}

	/**
	 * Tests the loading of schema block templates by using the filter that returns a faulty value.
	 *
	 * @covers ::load
	 */
	public function test_load_with_filter_returning_faulty_value() {
		// First add a template.
		Monkey\Filters\expectApplied( 'wpseo_schema_templates' )
			->andReturnFalse();

		Monkey\Functions\expect( 'wp_enqueue_script' )->never();
		Monkey\Functions\expect( 'wp_enqueue_style' )->never();

		$this->instance->load();
	}

	/**
	 * Tests the loading of a schema block template that doesn't exists.
	 *
	 * @covers ::load
	 */
	public function test_load_with_non_existing_template() {
		$this->instance->register_template( WPSEO_PATH . '/src/schema-templates/nonexisting.block.php' );

		Monkey\Functions\expect( 'wp_enqueue_script' )->once();
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$this->instance->load();

		$this->expectOutput( '' );
	}

	/**
	 * Tests the loading of schema block templates with no templates being set.
	 *
	 * @covers ::load
	 */
	public function test_load_with_having_no_templates_set() {
		Monkey\Filters\expectApplied( 'wpseo_schema_templates' );

		Monkey\Functions\expect( 'wp_enqueue_script' )->never();
		Monkey\Functions\expect( 'wp_enqueue_style' )->never();

		$this->instance->load();
	}
}
