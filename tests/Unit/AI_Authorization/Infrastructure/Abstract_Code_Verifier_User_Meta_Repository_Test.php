<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Code_Verifier_User_Meta_Repository_Test.
 *
 * @group AI_Authorization
 */
abstract class Abstract_Code_Verifier_User_Meta_Repository_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Code_Verifier_User_Meta_Repository
	 */
	protected $instance;

	/**
	 * The date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

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
		$this->date_helper = Mockery::mock( Date_Helper::class );
		$this->user_helper = Mockery::mock( User_Helper::class );
		$this->instance    = new Code_Verifier_User_Meta_Repository( $this->date_helper, $this->user_helper );
	}
}
