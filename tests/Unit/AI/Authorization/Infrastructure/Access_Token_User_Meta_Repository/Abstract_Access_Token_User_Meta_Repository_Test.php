<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Authorization\Infrastructure\Access_Token_User_Meta_Repository;

use Mockery;
use Yoast\WP\SEO\AI\Authorization\Infrastructure\Access_Token_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Access_Token_User_Meta_Repository tests.
 *
 * @group ai-authorization
 *
 * phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Access_Token_User_Meta_Repository_Test extends TestCase {

	/**
	 * The user helper instance.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The instance to test.
	 *
	 * @var Access_Token_User_Meta_Repository
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Access_Token_User_Meta_Repository( $this->user_helper );
	}
}
