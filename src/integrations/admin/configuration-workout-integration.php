<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * ConfigurationWorkoutsIntegration class
 */
class Configuration_Workout_Integration implements Integration_Interface {

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Configuration_Workout_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 * @param Options_Helper            $options_helper      The options helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Options_Helper $options_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->options_helper      = $options_helper;
	}

	/**
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Adds the data for the configuration workout to the wpseoWorkoutsData object.
	 */
	public function enqueue_assets() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Date is not processed or saved.
		if ( ! isset( $_GET['page'] ) || $_GET['page'] !== 'wpseo_workouts' ) {
			return;
		}

		$social_profiles = $this->get_social_profiles();

		$this->admin_asset_manager->add_inline_script(
			'workouts',
			\sprintf(
				'window.wpseoWorkoutsData["configuration"] = {
					"iscompany": %d,
					"companyName": "%s",
					"companyLogo": "%s",
					"companyLogoId": %d,
					"personId": %d,
					"personLogo": "%s",
					"personLogoId": %d,
					"siteTagline": "%s",
					"socialProfiles": {
						"facebookUrl": "%s",
						"twitterUsername": "%s",
						"instagramUrl": "%s",
						"linkedinUrl": "%s",
						"myspaceUrl": "%s",
						"pinterestUrl": "%s",
						"youtubeUrl": "%s",
						"wikipediaUrl": "%s",
					},
					"tracking": %d,
				};',
				$this->is_company(),
				$this->get_company_name(),
				$this->get_company_logo(),
				$this->get_company_logo_id(),
				$this->get_person_id(),
				$this->get_person_logo(),
				$this->get_person_logo_id(),
				$this->get_site_tagline(),
				$social_profiles['facebook_url'],
				$social_profiles['twitter_username'],
				$social_profiles['instagram_url'],
				$social_profiles['linkedin_url'],
				$social_profiles['myspace_url'],
				$social_profiles['pinterest_url'],
				$social_profiles['youtube_url'],
				$social_profiles['wikipedia_url'],
				$this->has_tracking_enabled()
			),
			'before'
		);
	}

	// ** Private functions ** //

	/**
	 * Checks if the site represents an company.
	 *
	 * @return bool True if the site represents an company, false if the site represents a person.
	 */
	private function is_company() {
		return $this->options_helper->get( 'company_or_person', '' ) === 'company';
	}

	/**
	 * Gets the company name from the option in the database.
	 *
	 * @return string The company name.
	 */
	private function get_company_name() {
		return $this->options_helper->get( 'company_name', '' );
	}

	/**
	 * Gets the company logo from the option in the database.
	 *
	 * @return string The company logo.
	 */
	private function get_company_logo() {
		return $this->options_helper->get( 'company_logo', '' );
	}

	/**
	 * Gets the company logo id from the option in the database.
	 *
	 * @return string The company logo id.
	 */
	private function get_company_logo_id() {
		return $this->options_helper->get( 'company_logo_id', '' );
	}

	/**
	 * Gets the person id from the option in the database.
	 *
	 * @return int|null The person id, null if empty.
	 */
	private function get_person_id() {
		return $this->options_helper->get( 'company_or_person_user_id' );
	}

	/**
	 * Gets the person avatar from the option in the database.
	 *
	 * @return string The person logo.
	 */
	private function get_person_logo() {
		return $this->options_helper->get( 'person_logo', '' );
	}

	/**
	 * Gets the person logo id from the option in the database.
	 *
	 * @return string The person logo id.
	 */
	private function get_person_logo_id() {
		return $this->options_helper->get( 'person_logo_id', '' );
	}

	/**
	 * Gets the site tagline.
	 *
	 * @return string The site tagline.
	 */
	private function get_site_tagline() {
		return \get_bloginfo( 'description' );
	}

	/**
	 * Gets the social profiles stored in the database.
	 *
	 * @return string[] The social profiles.
	 */
	private function get_social_profiles() {
		return [
			'facebook_url'     => $this->options_helper->get( 'facebook_site', '' ),
			'twitter_username' => $this->options_helper->get( 'twitter_site', '' ),
			'instagram_url'    => $this->options_helper->get( 'instagram_url', '' ),
			'linkedin_url'     => $this->options_helper->get( 'linkedin_url', '' ),
			'myspace_url'      => $this->options_helper->get( 'myspace_url', '' ),
			'pinterest_url'    => $this->options_helper->get( 'pinterest_url', '' ),
			'youtube_url'      => $this->options_helper->get( 'youtube_url', '' ),
			'wikipedia_url'    => $this->options_helper->get( 'wikipedia_url', '' ),
		];
	}

	/**
	 * Checks whether tracking is enabled.
	 *
	 * @return bool True if tracking is enabled, false otherwise.
	 */
	private function has_tracking_enabled() {
		return $this->options_helper->get( 'tracking', false );
	}
}
