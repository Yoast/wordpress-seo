<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Refresh_Token_User_Meta_Repository_Test.
 *
 * @group AI_Authorization
 */
abstract class Abstract_Refresh_Token_User_Meta_Repository_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Refresh_Token_User_Meta_Repository
	 */
	protected $instance;

	/**
	 * The user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Sets up the tess.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->user_helper = Mockery::mock( User_Helper::class );
		$this->instance    = new Refresh_Token_User_Meta_Repository( $this->user_helper );
	}
}
