<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\WordPress_Version_Conditional;
use Yoast\WP\SEO\Helpers\Language_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Abilities_Integration class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration
 */
final class Abilities_Integration_Test extends TestCase {

	/**
	 * The score retriever mock.
	 *
	 * @var Mockery\MockInterface|Score_Retriever
	 */
	private $score_retriever;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * The language helper mock.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language_helper;

	/**
	 * The instance under test.
	 *
	 * @var Abilities_Integration
	 */
	private $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->score_retriever = Mockery::mock( Score_Retriever::class );
		$this->options_helper  = Mockery::mock( Options_Helper::class );
		$this->language_helper = Mockery::mock( Language_Helper::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->options_helper,
			$this->language_helper,
		);
	}

	/**
	 * Tests that get_conditionals returns the WordPress version conditional.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertSame(
			[ WordPress_Version_Conditional::class ],
			Abilities_Integration::get_conditionals(),
		);
	}

	/**
	 * Tests that register_hooks registers the correct actions.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		Monkey\Actions\expectAdded( 'wp_abilities_api_categories_init' )
			->once()
			->with( [ $this->instance, 'register_categories' ] );

		Monkey\Actions\expectAdded( 'wp_abilities_api_init' )
			->once()
			->with( [ $this->instance, 'register_abilities' ] );

		$this->instance->register_hooks();
	}

	/**
	 * Tests that can_read_scores returns true for a user with edit_posts capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_true_for_user_with_edit_posts() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_posts' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_read_scores() );
	}

	/**
	 * Tests that can_read_scores returns false for a user without edit_posts capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_false_for_user_without_edit_posts() {
		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'edit_posts' )
			->andReturn( false );

		$this->assertFalse( $this->instance->can_read_scores() );
	}
}
