<?php

namespace Yoast\WP\SEO\Introductions\Application;

use WP_User;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Interface;
use Yoast\WP\SEO\Introductions\Domain\Introduction_Item;
use Yoast\WP\SEO\Introductions\Domain\Introductions_Bucket;

/**
 * Manages the collection of introductions.
 *
 * @makePublic
 */
class Introductions_Collector {

	/**
	 * Holds the add-on manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Holds the current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Holds all the introductions.
	 *
	 * @var Introduction_Interface[]
	 */
	private $introductions;

	/**
	 * Constructs the collector.
	 *
	 * @param WPSEO_Addon_Manager    $addon_manager       The add-on manager.
	 * @param Current_Page_Helper    $current_page_helper The current page helper.
	 * @param Options_Helper         $options_helper      The options helper.
	 * @param Introduction_Interface ...$introductions    All the introductions.
	 */
	public function __construct(
		WPSEO_Addon_Manager $addon_manager,
		Current_Page_Helper $current_page_helper,
		Options_Helper $options_helper,
		Introduction_Interface ...$introductions
	) {
		$this->addon_manager       = $addon_manager;
		$this->current_page_helper = $current_page_helper;
		$this->options_helper      = $options_helper;
		$this->introductions       = $this->add_introductions( ...$introductions );
	}

	/**
	 * Gets the data for the introductions.
	 *
	 * @param WP_User $user The user.
	 *
	 * @return array The list of introductions.
	 */
	public function get_for( WP_User $user ) {
		$bucket   = new Introductions_Bucket();
		$metadata = $this->get_metadata( $user->ID );

		foreach ( $this->introductions as $introduction ) {
			if ( ! $introduction->get_is_applicable() ) {
				continue;
			}
			if ( ! $this->is_new( $introduction->get_plugin(), $introduction->get_version() ) ) {
				continue;
			}
			if ( ! $this->is_user_allowed( $introduction->get_capabilities(), $user ) ) {
				continue;
			}
			if ( ! $this->is_on_page( $introduction->get_pages() ) ) {
				continue;
			}
			if ( $this->is_seen( $introduction->get_name(), $metadata ) ) {
				continue;
			}
			$bucket->add_introduction(
				new Introduction_Item( $introduction->get_name(), $introduction->get_priority(), $introduction->get_can_override() )
			);
		}

		return $bucket->to_array();
	}

	/**
	 * Filters introductions with the 'wpseo_introductions' filter.
	 *
	 * @param Introduction_Interface ...$introductions The introductions.
	 *
	 * @return Introduction_Interface[]
	 */
	private function add_introductions( Introduction_Interface ...$introductions ) {
		/**
		 * Filter: Adds the possibility to add additional introductions to be included.
		 *
		 * @internal
		 * @api Introduction_Interface This filter expects a list of Introduction_Interface instances and expects only Introduction_Interface implementations to be added to the list.
		 */
		$filtered_introductions = (array) \apply_filters( 'wpseo_introductions', $introductions );

		return \array_filter(
			$filtered_introductions,
			static function ( $introduction ) {
				return \is_a( $introduction, Introduction_Interface::class );
			}
		);
	}

	/**
	 * Determines whether the introduction is new.
	 *
	 * @param string $plugin  The applicable plugin.
	 * @param string $version The required version.
	 *
	 * @return bool Whether the introduction is new.
	 */
	private function is_new( $plugin, $version ) {
		// Exceptions for free.
		if ( $plugin === WPSEO_Addon_Manager::FREE_SLUG ) {
			// Bail if the current installation is a new one (not upgraded yet). Skipping this introduction.
			if ( $this->options_helper->get( 'previous_version', '' ) === '' ) {
				return false;
			}

			// Manually check the plugin, because it is only included if Premium is active.
			return (bool) \version_compare( $version, \WPSEO_VERSION, '>=' );
		}

		$addon_versions = $this->addon_manager->get_installed_addons_versions();
		if ( ! \array_key_exists( $plugin, $addon_versions ) ) {
			// Unknown plugin.
			return false;
		}

		return (bool) \version_compare( $version, $addon_versions[ $plugin ], '>=' );
	}

	/**
	 * Determines whether the user has the required capabilities.
	 *
	 * @param string[] $capabilities The required capabilities.
	 * @param WP_User  $user         The user.
	 *
	 * @return bool Whether the user has the required capabilities.
	 */
	private function is_user_allowed( $capabilities, WP_User $user ) {
		foreach ( $capabilities as $capability ) {
			if ( ! $user->has_cap( $capability ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Determines whether the current page is applicable.
	 *
	 * @param string[] $pages The applicable pages.
	 *
	 * @return bool Whether the current page is applicable.
	 */
	private function is_on_page( $pages ) {
		if ( ! $pages ) {
			// Handles the case for empty equals all Yoast pages.
			return $this->current_page_helper->is_yoast_seo_page();
		}

		return \in_array( $this->current_page_helper->get_current_yoast_seo_page(), $pages, true );
	}

	/**
	 * Retrieves the introductions metadata for the user.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return array The introductions' metadata.
	 */
	private function get_metadata( $user_id ) {
		$metadata = \get_user_meta( $user_id, '_yoast_wpseo_introductions', true );

		return ( ! \is_array( $metadata ) ) ? [] : $metadata;
	}

	/**
	 * Determines whether the user has seen the introduction.
	 *
	 * @param string   $name     The name.
	 * @param string[] $metadata The metadata.
	 *
	 * @return bool Whether the user has seen the introduction.
	 */
	private function is_seen( $name, $metadata ) {
		return \array_key_exists( $name, $metadata ) && $metadata[ $name ];
	}
}
