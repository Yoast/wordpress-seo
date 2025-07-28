<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Code_Verifier_User_Meta_Repository tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Code_Verifier_User_Meta_Repository_Test extends TestCase {

	/**
	 * The date helper instance.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The user helper instance.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The instance to test.
	 *
	 * @var Code_Verifier_User_Meta_Repository
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->date_helper = Mockery::mock( Date_Helper::class );
		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Code_Verifier_User_Meta_Repository( $this->date_helper, $this->user_helper );
	}
}
