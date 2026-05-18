<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Ability_Categories_Integration class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Ability_Categories_Integration
 */
final class Ability_Categories_Integration_Test extends TestCase {

	/**
	 * The instance under test.
	 *
	 * @var Ability_Categories_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->instance = new Ability_Categories_Integration();
	}

	/**
	 * Tests that get_conditionals returns the Abilities API conditional.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ Abilities_API_Conditional::class ],
			Ability_Categories_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that register_hooks registers the correct action.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wp_abilities_api_categories_init' )
			->once()
			->with( [ $this->instance, 'register_categories' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that register_categories registers the Yoast SEO category.
	 *
	 * @covers ::register_categories
	 *
	 * @return void
	 */
	public function test_register_categories() {
		Monkey\Functions\expect( 'wp_register_ability_category' )
			->once()
			->with(
				'yoast-seo',
				[
					'label'       => 'Yoast SEO',
					'description' => 'SEO analysis capabilities provided by Yoast SEO.',
				],
			);

		$this->instance->register_categories();
	}
}
