<?php

namespace Yoast\WP\SEO\Tests\Dependency_Injection;

use Yoast\WP\SEO\Dependency_Injection\Schema_Templates_Loader;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Schema_Templates_Loader_Test.
 *
 * @group dependency-injection
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dependency_Injection\Schema_Templates_Loader
 */
class Schema_Templates_Loader_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Schema_Templates_Loader
	 */
	protected $instance;

	/**
	 * Sets the instances to test.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Schema_Templates_Loader();
	}

	/**
	 * Tests the retrieval of the templates.
	 *
	 * @covers ::get_templates
	 */
	public function test_get_templates() {
		$expected_schema_blocks = [
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/address.block.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/address.schema.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/image.schema.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/ingredients.block.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/ingredients.schema.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/recipe.block.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/recipe.schema.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/step.block.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/step.schema.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/steps.block.php',
			dirname( WPSEO_FILE ) . '/config/dependency-injection/../../src/schema-templates/steps.schema.php',
		];

		static::assertEquals(
			$expected_schema_blocks,
			$this->instance->get_templates()
		);
	}
}
