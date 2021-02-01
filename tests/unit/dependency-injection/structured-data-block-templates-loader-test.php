<?php

namespace Yoast\WP\SEO\Tests\Dependency_Injection;

use Yoast\WP\SEO\Dependency_Injection\Structured_Data_Block_Templates_Loader;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Structured_Data_Block_Templates_Loader_Test.
 *
 * @group dependency-injection
 *
 * @coversDefaultClass \Yoast\WP\SEO\Dependency_Injection\Structured_Data_Block_Templates_Loader
 */
class Structured_Data_Block_Templates_Loader_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Structured_Data_Block_Templates_Loader
	 */
	protected $instance;

	/**
	 * Sets the instances to test.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new Structured_Data_Block_Templates_Loader();
	}

	/**
	 * Tests the retrieval of the templates.
	 *
	 * @covers ::get_templates
	 */
	public function test_get_templates() {
		$structured_data_block_templates_directory = dirname( WPSEO_FILE ) . '/src/structured-data-block-templates/';

		$expected_structured_data_block_templates = [
			$structured_data_block_templates_directory . 'address.block.php',
			$structured_data_block_templates_directory . 'address.schema.php',
			$structured_data_block_templates_directory . 'image.schema.php',
			$structured_data_block_templates_directory . 'ingredients.block.php',
			$structured_data_block_templates_directory . 'ingredients.schema.php',
			$structured_data_block_templates_directory . 'recipe.block.php',
			$structured_data_block_templates_directory . 'recipe.schema.php',
			$structured_data_block_templates_directory . 'step.block.php',
			$structured_data_block_templates_directory . 'step.schema.php',
			$structured_data_block_templates_directory . 'steps.block.php',
			$structured_data_block_templates_directory . 'steps.schema.php',
		];

		static::assertEquals(
			$expected_structured_data_block_templates,
			$this->instance->get_templates()
		);
	}
}
