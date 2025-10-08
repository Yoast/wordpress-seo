<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\User_Interface\Default_SEO_Data\Watcher;

use Mockery;
use Yoast\WP\SEO\Alerts\User_Interface\Default_SEO_Data\Default_SEO_Data_Watcher;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract test class for the Default_SEO_Data_Watcher class.
 *
 * @group Default_SEO_Data
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Default_SEO_Data_Watcher_Test extends TestCase {

	/**
	 * The Default_SEO_Data_Watcher instance.
	 *
	 * @var Default_SEO_Data_Watcher
	 */
	protected $instance;

	/**
	 * The indexable repository mock.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The options helper mock.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );

		$this->instance = new Default_SEO_Data_Watcher(
			$this->indexable_repository,
			$this->options_helper
		);
	}
}
