<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.

namespace Yoast\WP\SEO\MyYoast_Client\User_Interface;

use Yoast\WP\SEO\Conditionals\MyYoast_Connection_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\MyYoast_Client\Application\Callback_Outcome;
use Yoast\WP\SEO\MyYoast_Client\Application\Management_Endpoints_Repository;
use Yoast\WP\SEO\MyYoast_Client\Application\OAuth_Callback_Handler;

/**
 * Builds the MyYoast connection payload exposed to the Integrations page's
 * `wpseoIntegrationsData` global so the React app has the initial status and
 * the user-profile pointer without an extra fetch.
 *
 * Consumed by `Integrations_Page` through constructor injection.
 */
class Integrations_Page_Script_Data {

	/**
	 * The status presenter.
	 *
	 * @var Status_Presenter
	 */
	private $status_presenter;

	/**
	 * The MyYoast connection feature-flag conditional.
	 *
	 * @var MyYoast_Connection_Conditional
	 */
	private $myyoast_connection_conditional;

	/**
	 * The callback handler — reads the pending OAuth callback outcome.
	 *
	 * @var OAuth_Callback_Handler
	 */
	private $callback_handler;

	/**
	 * The short-link helper — builds the UTM/tracking query params for outbound links.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * The management endpoints repository — exposes the REST endpoint paths so the
	 * React app consumes them from one PHP-defined source instead of hardcoding them.
	 *
	 * @var Management_Endpoints_Repository
	 */
	private $endpoints_repository;

	/**
	 * Integrations_Page_Script_Data constructor.
	 *
	 * @param Status_Presenter                $status_presenter               The status presenter.
	 * @param MyYoast_Connection_Conditional  $myyoast_connection_conditional The MyYoast connection feature-flag conditional.
	 * @param OAuth_Callback_Handler          $callback_handler               The callback handler.
	 * @param Short_Link_Helper               $short_link_helper              The short-link helper.
	 * @param Management_Endpoints_Repository $endpoints_repository           The management endpoints repository.
	 */
	public function __construct(
		Status_Presenter $status_presenter,
		MyYoast_Connection_Conditional $myyoast_connection_conditional,
		OAuth_Callback_Handler $callback_handler,
		Short_Link_Helper $short_link_helper,
		Management_Endpoints_Repository $endpoints_repository
	) {
		$this->status_presenter               = $status_presenter;
		$this->myyoast_connection_conditional = $myyoast_connection_conditional;
		$this->callback_handler               = $callback_handler;
		$this->short_link_helper              = $short_link_helper;
		$this->endpoints_repository           = $endpoints_repository;
	}

	/**
	 * Returns the MyYoast connection payload, or `null` when the feature flag
	 * is disabled so the Integrations page can omit the key entirely.
	 *
	 * The `callbackOutcome` slot is populated (and consumed) when an OAuth
	 * callback finished for this user since the last time the Integrations page
	 * was rendered, so the React app can surface a one-shot notification.
	 *
	 * @return array{initialStatus: array{is_provisioned: bool, is_registered: bool, registered_at: int|null, registered_at_iso: string|null, redirect_uris: array<int, array{uri: string, origin: string, is_verified: bool}>, redirect_uris_match: bool}, callbackOutcome: array{kind: string, key: string}|null, linkParams: array<string, string>, endpoints: array<string, string>}|null
	 */
	public function present(): ?array {
		if ( ! $this->myyoast_connection_conditional->is_met() ) {
			return null;
		}

		return [
			'initialStatus'   => $this->status_presenter->present(),
			'callbackOutcome' => $this->consume_callback_outcome(),
			'linkParams'      => $this->short_link_helper->get_query_params(),
			'endpoints'       => $this->endpoints_repository->get_all_endpoints()->to_paths_array(),
		];
	}

	/**
	 * Reads and consumes the pending OAuth callback outcome for the current user
	 * and shapes it for the React app.
	 *
	 * @return array{kind: string, key: string}|null The outcome, or null when none is pending.
	 */
	private function consume_callback_outcome(): ?array {
		$outcome = $this->callback_handler->consume_outcome( \get_current_user_id() );
		if ( $outcome === null ) {
			return null;
		}

		if ( $outcome->is_success() ) {
			return [
				'kind' => 'success',
				'key'  => 'verify_success',
			];
		}

		return [
			'kind' => 'error',
			'key'  => $this->error_message_key( $outcome ),
		];
	}

	/**
	 * Maps a failed callback outcome to the front-end message key.
	 *
	 * Translates the neutral, native-OAuth outcome into the message keys the
	 * integrations-page JS understands (see `messageFor()` in
	 * `myyoast-integration.js`). The same missing code means different things per
	 * OAuth phase: a provider error other than `access_denied` is unexpected,
	 * while a token-endpoint error other than `invalid_grant` is a generic token
	 * failure.
	 *
	 * @param Callback_Outcome $outcome The failed callback outcome.
	 *
	 * @return string The message key the front-end maps to copy.
	 */
	private function error_message_key( Callback_Outcome $outcome ): string {
		if ( $outcome->get_error_phase() === Callback_Outcome::PHASE_PROVIDER ) {
			return ( $outcome->get_error_code() === 'access_denied' ) ? 'connection_cancelled' : 'unexpected_error';
		}

		if ( $outcome->get_error_code() === 'invalid_grant' ) {
			return 'token_request_failed_invalid_grant';
		}

		if ( $outcome->get_error_code() === null ) {
			return 'unexpected_error';
		}

		return 'token_request_failed';
	}
}
