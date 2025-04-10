<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Dashboard\Application\Configuration;

use Mockery;
use Yoast\WP\SEO\Dashboard\Application\Configuration\Dashboard_Configuration;
use Yoast\WP\SEO\Dashboard\Application\Content_Types\Content_Types_Repository;
use Yoast\WP\SEO\Dashboard\Application\Endpoints\Endpoints_Repository;
use Yoast\WP\SEO\Dashboard\Application\Tracking\Setup_Steps_Tracking;
use Yoast\WP\SEO\Dashboard\Infrastructure\Integrations\Site_Kit;
use Yoast\WP\SEO\Dashboard\Infrastructure\Nonces\Nonce_Repository;
use Yoast\WP\SEO\Editors\Application\Analysis_Features\Enabled_Analysis_Features_Repository;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for the setup steps tracking tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Dashboard_Configuration_Test extends TestCase {

	/**
	 * The content types repository.
	 *
	 * @var Content_Types_Repository
	 */
	protected $content_types_repository;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * The user helper.
	 *
	 * @var User_Helper
	 */
	protected $user_helper;

	/**
	 * The enabled analysis features repository.
	 *
	 * @var Enabled_Analysis_Features_Repository
	 */
	protected $enabled_analysis_features_repository;

	/**
	 * The endpoints repository.
	 *
	 * @var Endpoints_Repository
	 */
	protected $endpoints_repository;

	/**
	 * The nonces repository.
	 *
	 * @var Nonce_Repository
	 */
	protected $nonce_repository;

	/**
	 * The site kit integration data.
	 *
	 * @var Site_Kit
	 */
	protected $site_kit_integration_data;

	/**
	 * The setup steps tracking data.
	 *
	 * @var Setup_Steps_Tracking
	 */
	protected $setup_steps_tracking;

	/**
	 * Holds the instance.
	 *
	 * @var Dashboard_Configuration
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->content_types_repository             = Mockery::mock( Content_Types_Repository::class );
		$this->indexable_helper                     = Mockery::mock( Indexable_Helper::class );
		$this->user_helper                          = Mockery::mock( User_Helper::class );
		$this->enabled_analysis_features_repository = Mockery::mock( Enabled_Analysis_Features_Repository::class );
		$this->endpoints_repository                 = Mockery::mock( Endpoints_Repository::class );
		$this->nonce_repository                     = Mockery::mock( Nonce_Repository::class );
		$this->site_kit_integration_data            = Mockery::mock( Site_Kit::class );
		$this->setup_steps_tracking                 = Mockery::mock( Setup_Steps_Tracking::class );

		$this->instance = new Dashboard_Configuration(
			$this->content_types_repository,
			$this->indexable_helper,
			$this->user_helper,
			$this->enabled_analysis_features_repository,
			$this->endpoints_repository,
			$this->nonce_repository,
			$this->site_kit_integration_data,
			$this->setup_steps_tracking
		);
	}
}
