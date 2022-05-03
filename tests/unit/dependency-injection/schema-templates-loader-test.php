<?php

namespace Yoast\WP\SEO\Tests\Unit\Dependency_Injection;

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
	public function set_up() {
		parent::set_up();

		$this->instance = new Schema_Templates_Loader();
	}

	/**
	 * Tests the retrieval of the templates.
	 *
	 * @covers ::get_templates
	 */
	public function test_get_templates() {
		$schema_directory = 'src/schema-templates/';

		$expected_schema_blocks = [
			$schema_directory . 'cooking-time.block.php',
			$schema_directory . 'cooking-time.schema.php',
			$schema_directory . 'image.schema.php',
			$schema_directory . 'preparation-time.block.php',
			$schema_directory . 'preparation-time.schema.php',
			$schema_directory . 'recipe-description.block.php',
			$schema_directory . 'recipe-description.schema.php',
			$schema_directory . 'recipe-ingredients.block.php',
			$schema_directory . 'recipe-ingredients.schema.php',
			$schema_directory . 'recipe-instructions.block.php',
			$schema_directory . 'recipe-instructions.schema.php',
			$schema_directory . 'recipe-name.block.php',
			$schema_directory . 'recipe-name.schema.php',
			$schema_directory . 'recipe.block.php',
			$schema_directory . 'recipe.schema.php',
		];

		static::assertEquals(
			$expected_schema_blocks,
			$this->instance->get_templates()
		);
	}
}
