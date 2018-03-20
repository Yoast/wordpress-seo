<?php
/**
 * @package WPSEO\Internals\Options
 */

/**
 * Backfill the removed options.
 *
 * @since 7.0.2
 */
class WPSEO_Options_Backfill implements WPSEO_WordPress_Integration {
	/** @var bool Are the filters hooked or not. */
	protected $hooked = false;

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		// Make sure we don't hook multiple times.
		if ( $this->hooked ) {
			return;
		}

		$this->hooked = true;

		// Backfill options that were removed.
		foreach ( $this->get_lookups() as $option ) {
			add_filter( 'pre_option_' . $option, array( $this, 'backfill_option' ), 10, 2 );
		}

		// Make sure renamed meta key is backfilled.
		add_filter( 'get_user_metadata', array( $this, 'backfill_usermeta' ), 10, 3 );

		// Extend the options that have removed items.
		add_filter( 'option_wpseo_titles', array( $this, 'extend_wpseo_titles' ), 10, 1 );
		add_filter( 'option_wpseo', array( $this, 'extend_wpseo' ), 10, 1 );
	}

	/**
	 * Removes the option filters.
	 */
	public function remove_hooks() {
		// Remove backfill options filter.
		foreach ( $this->get_lookups() as $option ) {
			remove_filter( 'pre_option_' . $option, array( $this, 'backfill_option' ), 10 );
		}

		// Remove user meta filter.
		remove_filter( 'get_user_metadata', array( $this, 'backfill_usermeta' ), 10 );

		// Remove option extending filters.
		remove_filter( 'option_wpseo_titles', array( $this, 'extend_wpseo_titles' ), 10 );
		remove_filter( 'option_wpseo', array( $this, 'extend_wpseo' ), 10 );

		$this->hooked = false;
	}

	/**
	 * Retrieves the options that need to be backfilled.
	 *
	 * @since 7.0.2
	 *
	 * @return array List of options that need to be backfilled.
	 */
	protected function get_lookups() {
		return array(
			'wpseo_internallinks',
			'wpseo_rss',
			'wpseo_xml',
			'wpseo_permalinks',
		);
	}

	/**
	 * Retrieves the settings for the specified option.
	 *
	 * @since 7.0.2
	 *
	 * @param string $option The option to get the settings for.
	 *
	 * @return array The settings for the provided option.
	 */
	protected function get_settings( $option ) {
		$settings = array(
			'wpseo'               => array(
				'website_name'           => 'website_name',
				'alternate_website_name' => 'alternate_website_name',
				'company_logo'           => 'company_logo',
				'company_name'           => 'company_name',
				'company_or_person'      => 'company_or_person',
				'person_name'            => 'person_name',
			),
			'wpseo_internallinks' =>
				array(
					'breadcrumbs-404crumb'      => 'breadcrumbs-404crumb',
					'breadcrumbs-blog-remove'   => 'breadcrumbs-display-blog-page',
					'breadcrumbs-boldlast'      => 'breadcrumbs-boldlast',
					'breadcrumbs-archiveprefix' => 'breadcrumbs-archiveprefix',
					'breadcrumbs-enable'        => 'breadcrumbs-enable',
					'breadcrumbs-home'          => 'breadcrumbs-home',
					'breadcrumbs-prefix'        => 'breadcrumbs-prefix',
					'breadcrumbs-searchprefix'  => 'breadcrumbs-searchprefix',
					'breadcrumbs-sep'           => 'breadcrumbs-sep',
				),

			'wpseo_rss'        =>
				array(
					'rssbefore' => 'rssbefore',
					'rssafter'  => 'rssafter',
				),
			'wpseo_xml'        =>
				array(
					'enablexmlsitemap'       => 'enable_xml_sitemap',
					'disable_author_sitemap' => 'noindex-author-wpseo',
					'disable_author_noposts' => 'noindex-author-noposts-wpseo',
				),
			'wpseo_permalinks' => array(
				'redirectattachment' => 'disable-attachment',
				'stripcategorybase'  => 'stripcategorybase',
			),
		);

		if ( ! isset( $settings[ $option ] ) ) {
			return array();
		}

		return $settings[ $option ];
	}

	/**
	 * Extends the WPSEO option with the removed option values.
	 *
	 * @since 7.0.2
	 *
	 * @param array $data The data of the option.
	 *
	 * @return array Modified data.
	 */
	public function extend_wpseo( $data ) {
		// Make sure we don't get stuck in an infinite loop.
		static $running = false;

		// If we are already running, don't run again.
		if ( $running ) {
			return $data;
		}
		$running = true;

		foreach ( $this->get_settings( 'wpseo' ) as $old_key => $new_key ) {
			$data[ $old_key ] = WPSEO_Options::get( $new_key );
		}

		// Ended running.
		$running = false;

		return $data;
	}

	/**
	 * Extends the WPSEO Title with removed attributes.
	 *
	 * @since 7.0.2
	 *
	 * @param array $data Data of the option.
	 *
	 * @return array Extended data.
	 */
	public function extend_wpseo_titles( $data ) {
		// Make sure we don't get stuck in an infinite loop.
		static $running = false;

		// If we are already running, don't run again.
		if ( $running ) {
			return $data;
		}
		$running = true;

		$data['breadcrumbs-blog-remove'] = ! WPSEO_Options::get( 'breadcrumbs-display-blog-page' );

		$running = false;

		$data = $this->add_hideeditbox( $data );

		return $data;
	}

	/**
	 * Backfills the options that have been removed with the current values.
	 *
	 * @since 7.0.2
	 *
	 * @param mixed  $value  Current value for the option.
	 * @param string $option Name of the option.
	 *
	 * @return array Option data.
	 */
	public function backfill_option( $value, $option ) {
		$output = array();

		foreach ( $this->get_settings( $option ) as $old_key => $new_key ) {
			$output[ $old_key ] = WPSEO_Options::get( $new_key );
		}

		$output = $this->apply_permalinks_settings( $output, $option );
		$output = $this->apply_xml_settings( $output, $option );

		return $output;
	}

	/**
	 * Backfills removed user meta fields.
	 *
	 * @since 7.0.2
	 *
	 * @param mixed  $value     The current value.
	 * @param int    $object_id The user ID.
	 * @param string $meta_key  The meta key.
	 *
	 * @return mixed The backfilled value if applicable.
	 */
	public function backfill_usermeta( $value, $object_id, $meta_key ) {
		if ( $meta_key !== 'wpseo_excludeauthorsitemap' ) {
			return $value;
		}

		return get_user_meta( $object_id, 'wpseo_noindex_author' );
	}

	/**
	 * Extends the data of the option with the deprecated values.
	 *
	 * @since 7.0.2
	 *
	 * @param array $data Current data of the option.
	 *
	 * @return array Extended data.
	 */
	protected function add_hideeditbox( $data ) {
		foreach ( $data as $key => $value ) {
			if ( strpos( $key, 'display-metabox-tax-' ) === 0 ) {
				$taxonomy                               = substr( $key, strlen( 'display-metabox-tax-' ) );
				$data[ 'hideeditbox-tax-' . $taxonomy ] = ! $value;
				continue;
			}

			if ( strpos( $key, 'display-metabox-pt-' ) === 0 ) {
				$post_type                           = substr( $key, strlen( 'display-metabox-pt-' ) );
				$data[ 'hideeditbox-' . $post_type ] = ! $value;
				continue;
			}
		}

		return $data;
	}

	/**
	 * Adds the permalinks specific data to the option when requested.
	 *
	 * @since 7.0.2
	 *
	 * @param array  $data   Current data.
	 * @param string $option The option that is being parsed.
	 *
	 * @return array Extended data.
	 */
	protected function apply_permalinks_settings( $data, $option ) {
		if ( $option !== 'wpseo_permalinks' ) {
			return $data;
		}

		// Add defaults for completely removed settings in the option.
		return array_merge(
			$data,
			array(
				'cleanpermalinks'                 => false,
				'cleanpermalink-extravars'        => '',
				'cleanpermalink-googlecampaign'   => false,
				'cleanpermalink-googlesitesearch' => false,
				'cleanreplytocom'                 => false,
				'cleanslugs'                      => false,
				'trailingslash'                   => false,
			)
		);
	}

	/**
	 * Adds the XML specific data to the option when requested.
	 *
	 * @since 7.0.2
	 *
	 * @param array  $data   Current data.
	 * @param string $option The option that is being parsed.
	 *
	 * @return array Extended data.
	 */
	protected function apply_xml_settings( $data, $option ) {
		if ( $option !== 'wpseo_xml' ) {
			return $data;
		}

		// Add dynamic implementations for settings that are not in any option anymore.
		return array_merge(
			$data,
			array(
				'entries-per-page' => (int) apply_filters( 'wpseo_sitemap_entries_per_page', 1000 ),
				'excluded-posts'   => apply_filters( 'wpseo_exclude_from_sitemap_by_post_ids', array() ),
			)
		);
	}
}
