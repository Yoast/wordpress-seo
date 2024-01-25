<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Indexables\Application\Actions;

use Generator;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\SEO\Indexables\Application\Actions\Verify_Indexable_Action_Factory;
use Yoast\WP\SEO\Indexables\Domain\Actions\Verify_Indexables_Action_Interface;
use Yoast\WP\SEO\Indexables\Domain\Current_Verification_Action;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\No_Verification_Action_Left_Exception;
use Yoast\WP\SEO\Indexables\Domain\Exceptions\Verify_Action_Not_Found_Exception;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_General_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Post_Type_Archives_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Indexables_Action;
use Yoast\WP\SEO\Indexables\Infrastructure\Actions\Verify_Term_Links_Indexables_Action;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Verify_Indexable_Action_Factory_Test.
 *
 * @group indexables
 *
 * @coversDefaultClass \Yoast\WP\SEO\Indexables\Application\Actions\Verify_Indexable_Action_Factory
 */
final class Verify_Indexable_Action_Factory_Test extends TestCase {

	/**
	 * The term action.
	 *
	 * @var MockInterface|Verify_Term_Indexables_Action $term_action
	 */
	private $term_action;

	/**
	 * The general action.
	 *
	 * @var MockInterface|Verify_General_Indexables_Action $general_action
	 */
	private $general_action;

	/**
	 * The post type action.
	 *
	 * @var MockInterface|Verify_Post_Type_Archives_Indexables_Action $post_type_action
	 */
	private $post_type_action;

	/**
	 * The term action.
	 *
	 * @var MockInterface|Verify_Term_Links_Indexables_Action $term_link_action
	 */
	private $term_link_action;

	/**
	 * The instance to test.
	 *
	 * @var Verify_Indexable_Action_Factory $instance
	 */
	private $instance;

	/**
	 * The setup function.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->term_action      = Mockery::mock( Verify_Term_Indexables_Action::class );
		$this->general_action   = Mockery::mock( Verify_General_Indexables_Action::class );
		$this->post_type_action = Mockery::mock( Verify_Post_Type_Archives_Indexables_Action::class );
		$this->term_link_action = Mockery::mock( Verify_Term_Links_Indexables_Action::class );

		$this->instance = new Verify_Indexable_Action_Factory( $this->term_action, $this->general_action, $this->post_type_action, $this->term_link_action );
	}

	/**
	 * Tests the get function.
	 *
	 * @covers ::get
	 * @covers ::__construct
	 *
	 * @dataProvider indexable_action_factory_data_provider
	 *
	 * @param Current_Verification_Action                      $verification_action The given verification action.
	 * @param MockInterface|Verify_Indexables_Action_Interface $expected_result     The expected result.
	 *
	 * @throws Verify_Action_Not_Found_Exception When the given action is not found.
	 * @return void
	 */
	public function test_get( $verification_action, $expected_result ) {
		$this->assertSame( \get_class( $expected_result ), \get_class( $this->instance->get( $verification_action ) ) );
	}

	/**
	 * Provides data for the `test_get` function.
	 *
	 * @return Generator
	 */
	public function indexable_action_factory_data_provider() {
		yield 'Get term action' => [
			'verification_action' => new Current_Verification_Action( 'term' ),
			'expected_result'     => Mockery::mock( Verify_Term_Indexables_Action::class ),
		];

		yield 'Get general action' => [
			'verification_action' => new Current_Verification_Action( 'general' ),
			'expected_result'     => Mockery::mock( Verify_General_Indexables_Action::class ),
		];

		yield 'Get post type archives action' => [
			'verification_action' => new Current_Verification_Action( 'post-type-archives' ),
			'expected_result'     => Mockery::mock( Verify_Post_Type_Archives_Indexables_Action::class ),
		];
		yield 'Get term link action' => [
			'verification_action' => new Current_Verification_Action( 'term-links' ),
			'expected_result'     => Mockery::mock( Verify_Term_Links_Indexables_Action::class ),
		];
	}

	/**
	 * Tests if the exception gets thrown if the verification action does not exist.
	 *
	 * @covers ::get
	 * @throws Verify_Action_Not_Found_Exception Throws when the action is not found.
	 * @return void
	 */
	public function test_get_exception() {
		$this->expectException( Verify_Action_Not_Found_Exception::class );

		$this->instance->get( new Current_Verification_Action( 'nothing' ) );
	}

	/**
	 * Tests if the exception gets thrown if a non existing action is given.
	 *
	 * @covers ::determine_next_verify_action
	 * @throws No_Verification_Action_Left_Exception Throws when no verification action is left.
	 * @return void
	 */
	public function test_determine_next_verify_action_no_existing_action() {
		$this->expectException( No_Verification_Action_Left_Exception::class );

		$this->instance->determine_next_verify_action( new Current_Verification_Action( 'nothing' ) );
	}

	/**
	 * Tests if the exception gets thrown if no actions are left.
	 *
	 * @covers ::determine_next_verify_action
	 * @throws No_Verification_Action_Left_Exception Throws when no verification action is left.
	 * @return void
	 */
	public function test_determine_next_verify_action_no_actions_left() {
		$this->expectException( No_Verification_Action_Left_Exception::class );

		$this->instance->determine_next_verify_action( new Current_Verification_Action( 'term_links' ) );
	}

	/**
	 * Tests getting the next action.
	 *
	 * @covers ::determine_next_verify_action
	 * @throws No_Verification_Action_Left_Exception Throws when no verification action is left.
	 * @return void
	 */
	public function test_determine_next_verify_action() {
		$next_action = new Current_Verification_Action( 'term_links' );
		$result      = $this->instance->determine_next_verify_action( new Current_Verification_Action( 'post-type-archives' ) );
		$this->assertSame( $next_action->get_action(), $result->get_action() );
	}
}
