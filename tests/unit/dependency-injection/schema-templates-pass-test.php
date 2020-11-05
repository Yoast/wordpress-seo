<?php

namespace Yoast\WP\SEO\Tests\Dependency_Injection;

use Mockery;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Dependency_Injection\Schema_Templates_Pass;
use Yoast\WP\SEO\Integrations\Schema_Blocks;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Templates_Pass_Test.
 *
 * @group dependency-injection
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dependency_Injection\Schema_Templates_Pass
 */
class Schema_Templates_Pass_Test extends TestCase {

	/**
	 * Represents the container builder.
	 *
	 * @var Mockery\MockInterface|ContainerBuilder
	 */
	protected $container_builder;

	/**
	 * Represents the instance to test.
	 *
	 * @var Schema_Templates_Pass
	 */
	protected $instance;

	/**
	 * Sets the instances to test.
	 */
	public function setUp() {
		parent::setUp();

		$this->container_builder = Mockery::mock( ContainerBuilder::class );
		$this->instance = new Schema_Templates_Pass();
	}

	/**
	 * Tests the processing of the templates.
	 *
	 * @covers ::process
	 * @covers ::get_templates
	 */
	public function test_process() {
		$schema_blocks_definition = Mockery::mock();

		$this->container_builder
			->expects( 'getDefinition' )
			->once()
			->with( Schema_Blocks::class )
			->andReturn( $schema_blocks_definition );

		$expected_schema_blocks = [
			'src/schema-templates/address.block.php',
			'src/schema-templates/address.schema.php',
			'src/schema-templates/image.schema.php',
			'src/schema-templates/ingredients.block.php',
			'src/schema-templates/ingredients.schema.php',
			'src/schema-templates/recipe.block.php',
			'src/schema-templates/recipe.schema.php',
			'src/schema-templates/step.block.php',
			'src/schema-templates/step.schema.php',
			'src/schema-templates/steps.block.php',
			'src/schema-templates/steps.schema.php',
		];

		foreach ( $expected_schema_blocks as $expected_schema_block ) {
			$schema_blocks_definition
				->expects( 'addMethodCall' )
				->once()
				->with( 'register_template', [ $expected_schema_block ] );
		}

		$this->instance->process( $this->container_builder );
	}
}
