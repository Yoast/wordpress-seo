<?php

namespace Yoast\WP\SEO\Actions;

use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Class Alert_Dismissal_Action.
 */
class Alert_Dismissal_Action {

	const USER_META_KEY = '_yoast_alerts_dismissed';

	/**
	 * Holds the user helper instance.
	 *
	 * @var User_Helper
	 */
	protected $user;

	/**
	 * Constructs Alert_Dismissal_Action.
	 *
	 * @param User_Helper $user User helper.
	 */
	public function __construct( User_Helper $user ) {
		$this->user = $user;
	}

	/**
	 * Dismisses an alert.
	 *
	 * @param string $alert_identifier Alert identifier.
	 *
	 * @return boolean Whether the dismiss was successful or not.
	 */
	public function dismiss( $alert_identifier ) {
		$user_id = $this->user->get_current_user_id();
		if ( $user_id === 0 ) {
			return false;
		}

		$dismissed_alerts = $this->get_dismissed_alerts( $user_id );
		if ( $dismissed_alerts === false ) {
			return false;
		}

		if ( \array_key_exists( $alert_identifier, $dismissed_alerts ) === true ) {
			// The alert is already dismissed.
			return true;
		}

		// Add this alert to the dismissed alerts.
		$dismissed_alerts[ $alert_identifier ] = true;

		// Save.
		return $this->user->update_meta( $user_id, static::USER_META_KEY, $dismissed_alerts ) !== false;
	}

	/**
	 * Resets an alert.
	 *
	 * @param string $alert_identifier Alert identifier.
	 *
	 * @return boolean Whether the reset was successful or not.
	 */
	public function reset( $alert_identifier ) {
		$user_id = $this->user->get_current_user_id();
		if ( $user_id === 0 ) {
			return false;
		}

		$dismissed_alerts = $this->get_dismissed_alerts( $user_id );
		if ( $dismissed_alerts === false ) {
			return false;
		}

		$amount_of_dismissed_alerts = \count( $dismissed_alerts );
		if ( $amount_of_dismissed_alerts === 0 ) {
			// No alerts: nothing to reset.
			return true;
		}

		if ( \array_key_exists( $alert_identifier, $dismissed_alerts ) === false ) {
			// Alert not found: nothing to reset.
			return true;
		}

		if ( $amount_of_dismissed_alerts === 1 ) {
			// The 1 remaining dismissed alert is the alert to reset: delete the alerts user meta row.
			return $this->user->delete_meta( $user_id, static::USER_META_KEY, $dismissed_alerts );
		}

		// Remove this alert from the dismissed alerts.
		unset( $dismissed_alerts[ $alert_identifier ] );

		// Save.
		return $this->user->update_meta( $user_id, static::USER_META_KEY, $dismissed_alerts ) !== false;
	}

	/**
	 * Returns if an alert is dismissed or not.
	 *
	 * @param string $alert_identifier Alert identifier.
	 *
	 * @return bool Whether the alert has been dismissed.
	 */
	public function is_dismissed( $alert_identifier ) {
		$user_id = $this->user->get_current_user_id();
		if ( $user_id === 0 ) {
			return false;
		}

		$dismissed_alerts = $this->get_dismissed_alerts( $user_id );
		if ( $dismissed_alerts === false ) {
			return false;
		}

		return \array_key_exists( $alert_identifier, $dismissed_alerts );
	}

	/**
	 * Returns an object with all alerts dismissed by current user.
	 *
	 * @return array An array with the keys of all Alerts that have been dismissed by the current user.
	 */
	public function all_dismissed() {
		$user_id = $this->user->get_current_user_id();
		if ( $user_id === 0 ) {
			return false;
		}

		$dismissed_alerts = $this->get_dismissed_alerts( $user_id );
		if ( $dismissed_alerts === false ) {
			return false;
		}

		return $dismissed_alerts;
	}

	/**
	 * Retrieves the dismissed alerts.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return string[]|false The dismissed alerts. False for an invalid $user_id.
	 */
	protected function get_dismissed_alerts( $user_id ) {
		$dismissed_alerts = $this->user->get_meta( $user_id, static::USER_META_KEY, true );
		if ( $dismissed_alerts === false ) {
			// Invalid user ID.
			return false;
		}

		if ( $dismissed_alerts === '' ) {
			/*
			 * When no database row exists yet, an empty string is returned because of the `single` parameter.
			 * We do want a single result returned, but the default should be an empty array instead.
			 */
			return [];
		}

		return $dismissed_alerts;
	}
}
