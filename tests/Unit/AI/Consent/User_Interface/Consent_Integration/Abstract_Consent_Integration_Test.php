<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\User_Interface\Consent_Integration;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Endpoints_Repository;
use Yoast\WP\SEO\AI\Consent\User_Interface\Consent_Integration;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for AI_Consent_Integration tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Consent_Integration
	 */
	protected $instance;

	/**
	 * Represents the asset manager.
	 *
	 * @var Mockery\MockInterface|WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Represents the user helper.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * The short link helper.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	protected $short_link_helper;

	/**
	 * The consent endpoint repository.
	 *
	 * @var Mockery\MockInterface|Consent_Endpoints_Repository
	 */
	protected $consent_endpoint_repository;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->asset_manager     = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->user_helper       = Mockery::mock( User_Helper::class );
		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$this->consent_endpoint_repository = Mockery::mock( Consent_Endpoints_Repository::class );


		$this->instance = new Consent_Integration( $this->asset_manager, $this->user_helper, $this->short_link_helper, $this->consent_endpoint_repository );
	}
}
