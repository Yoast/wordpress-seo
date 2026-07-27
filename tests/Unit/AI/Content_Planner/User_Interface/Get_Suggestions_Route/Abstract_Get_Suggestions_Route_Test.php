<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\User_Interface\Get_Suggestions_Route;

use Mockery;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;
use Yoast\WP\SEO\AI\Content_Planner\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Get_Suggestions_Route tests.
 *
 * @group ai-content-planner
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Get_Suggestions_Route_Test extends TestCase {

	/**
	 * Holds the command handler mock.
	 *
	 * @var Mockery\MockInterface|Content_Suggestion_Command_Handler
	 */
	protected $command_handler;

	/**
	 * Holds the instance under test.
	 *
	 * @var Get_Suggestions_Route
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->command_handler = Mockery::mock( Content_Suggestion_Command_Handler::class );

		$this->instance = new Get_Suggestions_Route( $this->command_handler );
	}
}
