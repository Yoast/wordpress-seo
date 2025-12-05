<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Application\Code_Verifier_Handler;

use Mockery;
use Yoast\WP\SEO\AI\Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI\Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Code_Verifier_Handler tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Code_Verifier_Handler_Test extends TestCase {

	/**
	 * The date helper mock.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The code verifier repository mock.
	 *
	 * @var Mockery\MockInterface|Code_Verifier_User_Meta_Repository
	 */
	protected $code_verifier_repository;

	/**
	 * The instance to test.
	 *
	 * @var Code_Verifier_Handler
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->date_helper              = Mockery::mock( Date_Helper::class );
		$this->code_verifier_repository = Mockery::mock( Code_Verifier_User_Meta_Repository::class );

		$this->instance = new Code_Verifier_Handler( $this->date_helper, $this->code_verifier_repository );
	}
}
