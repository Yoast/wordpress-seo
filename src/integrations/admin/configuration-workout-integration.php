<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Routes\Indexing_Route;

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
	 * The product helper.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Product_Helper
	 */
	private $product_helper;

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
	 * @param Product_Helper            $product_helper      The product helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Options_Helper $options_helper,
		Product_Helper $product_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->options_helper      = $options_helper;
		$this->product_helper      = $product_helper;
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

		$this->admin_asset_manager->enqueue_script( 'indexation' );
		$this->admin_asset_manager->enqueue_style( 'admin-css' );
		$this->admin_asset_manager->enqueue_style( 'monorepo' );

		$data = [
			'disabled'     => ! YoastSEO()->helpers->indexable->should_index_indexables(),
			'amount'       => YoastSEO()->helpers->indexing->get_filtered_unindexed_count(),
			'firstTime'    => ( YoastSEO()->helpers->indexing->is_initial_indexing() === true ),
			'errorMessage' => '',
			'restApi'      => [
				'root'               => \esc_url_raw( \rest_url() ),
				'indexing_endpoints' => $this->get_endpoints(),
				'nonce'              => \wp_create_nonce( 'wp_rest' ),
			],
		];

		/**
		 * Filter: 'wpseo_indexing_data' Filter to adapt the data used in the indexing process.
		 *
		 * @param array $data The indexing data to adapt.
		 */
		$data = \apply_filters( 'wpseo_indexing_data', $data );

		$this->admin_asset_manager->localize_script( 'indexation', 'yoastIndexingData', $data );

		$social_profiles = $this->get_social_profiles();

		$this->admin_asset_manager->add_inline_script(
			'workouts',
			\sprintf(
				'window.wpseoWorkoutsData["configuration"] = {
					"companyOrPerson": "%s",
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
				$this->is_company_or_person(),
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

	/**
	 * Retrieves a list of the endpoints to use.
	 *
	 * @return array The endpoints.
	 */
	protected function get_endpoints() {
		$endpoints = [
			'prepare'            => Indexing_Route::FULL_PREPARE_ROUTE,
			'terms'              => Indexing_Route::FULL_TERMS_ROUTE,
			'posts'              => Indexing_Route::FULL_POSTS_ROUTE,
			'archives'           => Indexing_Route::FULL_POST_TYPE_ARCHIVES_ROUTE,
			'general'            => Indexing_Route::FULL_GENERAL_ROUTE,
			'indexablesComplete' => Indexing_Route::FULL_INDEXABLES_COMPLETE_ROUTE,
			'post_link'          => Indexing_Route::FULL_POST_LINKS_INDEXING_ROUTE,
			'term_link'          => Indexing_Route::FULL_TERM_LINKS_INDEXING_ROUTE,
		];

		$endpoints = \apply_filters( 'wpseo_indexing_endpoints', $endpoints );

		$endpoints['complete'] = Indexing_Route::FULL_COMPLETE_ROUTE;

		return $endpoints;
	}

	// ** Private functions ** //

	/**
	 * Returns the entity represented by the site.
	 *
	 * @return string The entity represented by the site.
	 */
	private function is_company_or_person() {
		return $this->options_helper->get( 'company_or_person', '' );
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
	 * @return int True if tracking is enabled, false otherwise, null if in Free and conf. workout step not finished.
	 */
	private function has_tracking_enabled() {
		$tracking = -1;
		// If in Premium, use the current setting.
		if ( $this->product_helper->is_premium() ) {
			$tracking = $this->options_helper->get( 'tracking', false );
		}

		// If in Free and the "tracking" step of the configuration workout is marked as finished, use the current setting.
		$workouts_option = $this->options_helper->get( 'workouts_data' );
		$finished_steps  = (array) $workouts_option['configuration']['finishedSteps'];
		if ( \in_array( 'enableTracking', $finished_steps, true ) ) {
			$tracking = $this->options_helper->get( 'tracking', false );
		}

		if ( \is_bool( $tracking ) ) {
			$tracking = (int) $tracking;
		}

		return $tracking;
	}
}
