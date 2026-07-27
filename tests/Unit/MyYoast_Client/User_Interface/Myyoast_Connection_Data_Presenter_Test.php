<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\MyYoast_Client\User_Interface;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Connection_Permission;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Myyoast_Connection_Data_Presenter;
use Yoast\WP\SEO\MyYoast_Client\User_Interface\Status_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Myyoast_Connection_Data_Presenter.
 *
 * @covers \Yoast\WP\SEO\MyYoast_Client\User_Interface\Myyoast_Connection_Data_Presenter::present
 */
final class Myyoast_Connection_Data_Presenter_Test extends TestCase {

	/**
	 * The status payload returned by the Status_Presenter.
	 *
	 * @var array<string, mixed>
	 */
	private const PROVISIONED_STATUS = [
		'is_provisioned'      => true,
		'is_registered'       => false,
		'registered_at'       => null,
		'registered_at_iso'   => null,
		'redirect_uris'       => [],
		'redirect_uris_match' => true,
	];

	/**
	 * The instance to test.
	 *
	 * @var Myyoast_Connection_Data_Presenter
	 */
	private $instance;

	/**
	 * The MyYoast connection feature-flag conditional mock.
	 *
	 * @var Mockery\MockInterface|MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The MyYoast connection status presenter mock.
	 *
	 * @var Mockery\MockInterface|Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection-management permission check mock.
	 *
	 * @var Mockery\MockInterface|Connection_Permission
	 */
	private $connection_permission;

	/**
	 * The short-link helper mock.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->myyoast_connection_conditional = Mockery::mock( MyYoast_Connection_Conditional::class );
		$this->status_presenter               = Mockery::mock( Status_Presenter::class );
		$this->connection_permission          = Mockery::mock( Connection_Permission::class );
		$this->short_link_helper              = Mockery::mock( Short_Link_Helper::class );

		$this->instance = new Myyoast_Connection_Data_Presenter(
			$this->myyoast_connection_conditional,
			$this->status_presenter,
			$this->connection_permission,
			$this->short_link_helper,
		);
	}

	/**
	 * Tests that the payload is null when the feature flag is disabled.
	 *
	 * @return void
	 */
	public function test_returns_null_when_feature_flag_disabled() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturnFalse();

		$this->assertNull( $this->instance->present() );
	}

	/**
	 * Tests the payload for a user who can connect: it carries the connect URL,
	 * built with the nonce appended via `add_query_arg()` so the `&` separators
	 * stay plain.
	 *
	 * The URL is localized and assigned to a React `href`, not printed as HTML, so
	 * it must not carry the HTML-encoded separators `wp_nonce_url()` would add —
	 * otherwise the browser sends `amp;start-myyoast-connection` as the query-arg
	 * name and the auto-start flow never triggers.
	 *
	 * @return void
	 */
	public function test_returns_connect_url_with_plain_separators_when_user_can_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturnTrue();
		$this->status_presenter->expects( 'present' )->once()->andReturn( self::PROVISIONED_STATUS );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturnTrue();

		Monkey\Functions\expect( 'self_admin_url' )
			->once()
			->andReturnFirstArg();
		Monkey\Functions\expect( 'wp_create_nonce' )
			->once()
			->with( 'wpseo-start-myyoast-connection' )
			->andReturn( 'abc123' );
		// add_query_arg keeps plain `&` separators; mirror that so the test proves
		// the URL is never HTML-encoded.
		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with(
				'_wpnonce',
				'abc123',
				'admin.php?page=wpseo_integrations&start-myyoast-connection=1',
			)
			->andReturn( 'admin.php?page=wpseo_integrations&start-myyoast-connection=1&_wpnonce=abc123' );

		$this->short_link_helper->expects( 'get' )
			->once()
			->with( 'https://yoa.st/ai-myyoast-connection' )
			->andReturn( 'https://yoa.st/ai-myyoast-connection?utm=1' );

		$expected = [
			'isProvisioned' => true,
			'canConnect'    => true,
			'connectUrl'    => 'admin.php?page=wpseo_integrations&start-myyoast-connection=1&_wpnonce=abc123',
			'learnMoreUrl'  => 'https://yoa.st/ai-myyoast-connection?utm=1',
		];

		$this->assertSame( $expected, $this->instance->present() );
	}

	/**
	 * Tests the payload for a user who cannot connect: the connect URL is omitted.
	 *
	 * @return void
	 */
	public function test_omits_connect_url_when_user_cannot_connect() {
		$this->myyoast_connection_conditional->expects( 'is_met' )->once()->andReturnTrue();
		$this->status_presenter->expects( 'present' )->once()->andReturn( self::PROVISIONED_STATUS );
		$this->connection_permission->expects( 'can_manage' )->once()->andReturnFalse();

		// No connect URL is built for a user who cannot connect.
		Monkey\Functions\expect( 'wp_create_nonce' )->never();
		Monkey\Functions\expect( 'add_query_arg' )->never();

		$this->short_link_helper->expects( 'get' )
			->once()
			->with( 'https://yoa.st/ai-myyoast-connection' )
			->andReturn( 'https://yoa.st/ai-myyoast-connection?utm=1' );

		$expected = [
			'isProvisioned' => true,
			'canConnect'    => false,
			'connectUrl'    => null,
			'learnMoreUrl'  => 'https://yoa.st/ai-myyoast-connection?utm=1',
		];

		$this->assertSame( $expected, $this->instance->present() );
	}
}
