<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Task_List\Application\Tasks\Complete_FTC;

use Mockery;
use Yoast\WP\SEO\Helpers\First_Time_Configuration_Notice_Helper;
use Yoast\WP\SEO\Task_List\Application\Tasks\Complete_FTC;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the Complete FTC task tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Complete_FTC_Test extends TestCase {

	/**
	 * The first time configuration notice helper.
	 *
	 * @var Mockery\MockInterface|First_Time_Configuration_Notice_Helper
	 */
	protected $ftc_notice_helper;

	/**
	 * Holds the instance.
	 *
	 * @var Complete_FTC
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubTranslationFunctions();

		$this->ftc_notice_helper = Mockery::mock( First_Time_Configuration_Notice_Helper::class );

		$this->instance = new Complete_FTC( $this->ftc_notice_helper );
	}
}
