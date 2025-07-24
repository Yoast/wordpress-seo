<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Consent\User_Interface\AI_Consent_Integration;

use Mockery;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\AI_Consent\User_Interface\Ai_Consent_Integration;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for AI_Consent_Integration tests.
 *
 * @group ai-consent
 */
abstract class Abstract_AI_Consent_Integration_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Ai_Consent_Integration
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
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();

		$this->asset_manager     = Mockery::mock( WPSEO_Admin_Asset_Manager::class );
		$this->user_helper       = Mockery::mock( User_Helper::class );
		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Ai_Consent_Integration( $this->asset_manager, $this->user_helper, $this->short_link_helper );
	}
}
