<?php

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Admin\Integrations_Page;

/**
 * Builds the read-only MyYoast connection payload consumed by editor scripts
 * to pick the correct "Yoast AI cannot reach your site" notification variant.
 *
 * Returns `null` when the feature flag is disabled, so consumers treat the
 * connection as unavailable and show the informational-only variant. The
 * payload is deliberately minimal — no store, actions, or tokens reach the
 * editor; the connect call-to-action is just a nonce-protected link that
 * auto-starts the flow on the Integrations page in a new tab.
 */
class Myyoast_Connection_Data_Presenter {

	/**
	 * The MyYoast connection feature-flag conditional.
	 *
	 * @var MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The MyYoast connection status presenter.
	 *
	 * @var Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection-management permission check.
	 *
	 * @var Connection_Permission
	 */
	private $connection_permission;

	/**
	 * The short-link helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Constructs the instance.
	 *
	 * @param MyYoast_Connection_Conditional $myyoast_connection_conditional The MyYoast connection feature-flag conditional.
	 * @param Status_Presenter               $status_presenter               The MyYoast connection status presenter.
	 * @param Connection_Permission          $connection_permission          The MyYoast connection-management permission check.
	 * @param Short_Link_Helper              $short_link_helper              The short-link helper.
	 */
	public function __construct(
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		Status_Presenter $status_presenter,
		Connection_Permission $connection_permission,
		Short_Link_Helper $short_link_helper
	) {
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
		$this->status_presenter               = $status_presenter;
		$this->connection_permission          = $connection_permission;
		$this->short_link_helper              = $short_link_helper;
	}

	/**
	 * Returns the connection payload, or `null` when the feature flag is disabled.
	 *
	 * @return array{isProvisioned: bool, canConnect: bool, connectUrl: string|null, learnMoreUrl: string}|null
	 */
	public function present() {
		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			return null;
		}

		$status      = $this->status_presenter->present();
		$can_connect = $this->connection_permission->can_manage();

		return [
			'isProvisioned' => \is_bool( $status['is_provisioned'] ) && $status['is_provisioned'],
			'canConnect'    => $can_connect,
			// Only users who can manage options can start the flow; for everyone
			// else the link is omitted and the editor shows the "ask your admin" variant.
			'connectUrl'    => ( $can_connect ) ? $this->get_connect_url() : null,
			'learnMoreUrl'  => $this->short_link_helper->get( 'https://yoa.st/ai-myyoast-connection' ),
		];
	}

	/**
	 * Builds the nonce-protected Integrations-page URL that auto-starts the
	 * MyYoast connection flow when opened.
	 *
	 * Built with `add_query_arg()` + `wp_create_nonce()` rather than `wp_nonce_url()`:
	 * the latter HTML-encodes the `&` separators for markup output, but this URL is
	 * localized and assigned to a React `href`, where it isn't decoded — the browser
	 * would then send `amp;start-myyoast-connection` as the query-arg name and the
	 * flow would never start. This form keeps the separators as plain `&`.
	 *
	 * @return string The connect URL.
	 */
	private function get_connect_url() {
		return \add_query_arg(
			'_wpnonce',
			\wp_create_nonce( 'wpseo-start-myyoast-connection' ),
			\self_admin_url( 'admin.php?page=' . Integrations_Page::PAGE . '&start-myyoast-connection=1' ),
		);
	}
}
