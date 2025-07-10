<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application;

use Mockery;
use Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler;
use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Abstract_Code_Verifier_Handler_Test.
 *
 * @group AI_Authorization
 */
abstract class Abstract_Code_Verifier_Handler_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Code_Verifier_Handler
	 */
	protected $instance;

	/**
	 * The user helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	protected $date_helper;

	/**
	 * The code verifier repository.
	 *
	 * @var Mockery\MockInterface|Code_Verifier_User_Meta_Repository
	 */
	protected $code_verifier_repository;

	/**
	 * Sets up the tess.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();
		$this->date_helper = Mockery::mock( Date_Helper::class );
		$this->code_verifier_repository = Mockery::mock( Code_Verifier_User_Meta_Repository::class );
		$this->instance    = new Code_Verifier_Handler( $this->date_helper, $this->code_verifier_repository );
	}
}
