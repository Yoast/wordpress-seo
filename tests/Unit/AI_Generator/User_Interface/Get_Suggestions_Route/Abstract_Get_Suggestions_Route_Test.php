<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Suggestions_Route;

use Mockery;
use Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Get_Suggestions_Route tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Get_Suggestions_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Get_Suggestions_Route
	 */
	protected $instance;

	/**
	 * Represents the suggestions provider.
	 *
	 * @var Mockery\MockInterface|Suggestions_Provider
	 */
	protected $suggestions_provider;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->suggestions_provider = Mockery::mock( Suggestions_Provider::class );

		$this->instance = new Get_Suggestions_Route( $this->suggestions_provider );
	}
}
