<?php

namespace Yoast\WP\SEO\Tests\Dependency_Injection;

use Mockery;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Yoast\WP\SEO\Dependency_Injection\Schema_Templates_Loader;
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
	 * Represents the schema templates loader.
	 *
	 * @var Mockery\MockInterface|Schema_Templates_Loader
	 */
	protected $templates_loader;

	/**
	 * Represents the instance to test.
	 *
	 * @var Schema_Templates_Pass
	 */
	protected $instance;

	/**
	 * Sets the instances to test.
	 */
	public function set_up() {
		parent::set_up();

		$this->container_builder = Mockery::mock( ContainerBuilder::class );
		$this->templates_loader  = Mockery::mock( Schema_Templates_Loader::class );
		$this->instance          = new Schema_Templates_Pass( $this->templates_loader );
	}

	/**
	 * Tests the processing of the templates.
	 *
	 * @covers ::process
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
		];

		$this->templates_loader
			->expects( 'get_templates' )
			->andReturn( $expected_schema_blocks );

		$schema_blocks_definition
			->expects( 'addMethodCall' )
			->once()
			->with( 'register_template', [ 'src/schema-templates/address.block.php' ] );

		$this->instance->process( $this->container_builder );
	}
}
