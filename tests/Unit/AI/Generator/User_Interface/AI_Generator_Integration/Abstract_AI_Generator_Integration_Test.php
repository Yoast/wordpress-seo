<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\AI_Generator_Integration;

use Mockery;
use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Planner_Endpoints_Repository;
use Yoast\WP\SEO\AI\Free_Sparks\Application\Free_Sparks_Endpoints_Repository;
use Yoast\WP\SEO\AI\Generator\Application\Generator_Endpoints_Repository;
use Yoast\WP\SEO\AI\Generator\User_Interface\Ai_Generator_Integration;
use Yoast\WP\SEO\AI\HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Introductions_Seen_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for AI_Generator_Integration tests.
 *
 * @group ai-generator
 */
abstract class Abstract_AI_Generator_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Ai_Generator_Integration
	 */
	protected $instance;

	/**
	 * Represents the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the add-on manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * Holds the API client instance.
	 *
	 * @var Mockery\MockInterface|API_Client
	 */
	protected $api_client;

	/**
	 * Represents the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Represents the options manager.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Represents the introductions seen repository.
	 *
	 * @var Mockery\MockInterface|Introductions_Seen_Repository
	 */
	protected $introductions_seen_repository;

	/**
	 * Represents the generator endpoints repository.
	 *
	 * @var Mockery\MockInterface|Generator_Endpoints_Repository
	 */
	protected $generator_endpoints_repository;

	/**
	 * Represents the consent endpoints repository.
	 *
	 * @var Mockery\MockInterface|Consent_Endpoints_Repository
	 */
	protected $consent_endpoints_repository;

	/**
	 * Represents the free sparks endpoints repository.
	 *
	 * @var Mockery\MockInterface|Free_Sparks_Endpoints_Repository
	 */
	protected $free_sparks_endpoints_repository;

	/**
	 * Represents the content planner endpoints repository.
	 *
	 * @var Mockery\MockInterface|Content_Planner_Endpoints_Repository
	 */
	protected $content_planner_endpoints_repository;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->asset_manager                        = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->addon_manager                        = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->api_client                           = Mockery::mock( API_Client::class );
		$this->current_page_helper                  = Mockery::mock( Current_Page_Helper::class );
		$this->options_helper                       = Mockery::mock( Options_Helper::class );
		$this->user_helper                          = Mockery::mock( User_Helper::class );
		$this->introductions_seen_repository        = Mockery::mock( Introductions_Seen_Repository::class );
		$this->generator_endpoints_repository       = Mockery::mock( Generator_Endpoints_Repository::class );
		$this->consent_endpoints_repository         = Mockery::mock( Consent_Endpoints_Repository::class );
		$this->free_sparks_endpoints_repository     = Mockery::mock( Free_Sparks_Endpoints_Repository::class );
		$this->content_planner_endpoints_repository = Mockery::mock( Content_Planner_Endpoints_Repository::class );

		$this->instance = new Ai_Generator_Integration(
			$this->asset_manager,
			$this->addon_manager,
			$this->api_client,
			$this->current_page_helper,
			$this->options_helper,
			$this->user_helper,
			$this->introductions_seen_repository,
			$this->generator_endpoints_repository,
			$this->consent_endpoints_repository,
			$this->free_sparks_endpoints_repository,
			$this->content_planner_endpoints_repository,
		);
	}
}
