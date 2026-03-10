<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Abilities\Application\Score_Retriever;
use Yoast\WP\SEO\Abilities\User_Interface\Abilities_Integration;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
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
	 * The capability helper mock.
	 *
	 * @var Mockery\MockInterface|Capability_Helper
	 */
	private $capability_helper;

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

		$this->score_retriever  = Mockery::mock( Score_Retriever::class );
		$this->capability_helper = Mockery::mock( Capability_Helper::class );
		$this->options_helper   = Mockery::mock( Options_Helper::class );
		$this->language_helper  = Mockery::mock( Language_Helper::class );

		$this->instance = new Abilities_Integration(
			$this->score_retriever,
			$this->capability_helper,
			$this->options_helper,
			$this->language_helper,
		);
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
	 * Tests that can_read_scores returns true for a user with wpseo_manage_options capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_true_for_user_with_manage_options() {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->assertTrue( $this->instance->can_read_scores() );
	}

	/**
	 * Tests that can_read_scores returns false for a user without wpseo_manage_options capability.
	 *
	 * @covers ::can_read_scores
	 *
	 * @return void
	 */
	public function test_can_read_scores_returns_false_for_user_without_manage_options() {
		$this->capability_helper
			->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$this->assertFalse( $this->instance->can_read_scores() );
	}
}
