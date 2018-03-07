<?php
/**
 * @package WPSEO\Internals\Options
 */

/**
 * Backfill the removed options in Yoast SEO 7.0
 *
 * @since 7.0.2
 */
class WPSEO_Options_Backfill implements WPSEO_WordPress_Integration {
	/** @var array List of options that have been removed. */
	protected $lookup = array(
		'wpseo_internallinks' => array(
			'breadcrumbs-404crumb'      => 'breadcrumbs-404crumb',
			'breadcrumbs-blog-remove'   => 'breadcrumbs-blog-remove',
			'breadcrumbs-boldlast'      => 'breadcrumbs-boldlast',
			'breadcrumbs-archiveprefix' => 'breadcrumbs-archiveprefix',
			'breadcrumbs-enable'        => 'breadcrumbs-enable',
			'breadcrumbs-home'          => 'breadcrumbs-home',
			'breadcrumbs-prefix'        => 'breadcrumbs-prefix',
			'breadcrumbs-searchprefix'  => 'breadcrumbs-searchprefix',
			'breadcrumbs-sep'           => 'breadcrumbs-sep',
		),
		'wpseo_rss'           => array(
			'rssbefore' => 'rssbefore',
			'rssafter'  => 'rssafter'
		),
		'wpseo_xml'           => array(
			'enablexmlsitemap'       => 'enable_xml_sitemap',
			'disable_author_sitemap' => 'noindex-author-wpseo',
			'disable_author_noposts' => 'noindex-author-noposts-wpseo',
		),
		'wpseo_permalinks'    => array(
			'redirectattachment' => 'disable-attachment',
			'stripcategorybase'  => 'stripcategorybase',
		)
	);

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		// Backfill options that were removed.
		foreach ( $this->lookup as $option => $fields ) {
			add_filter( 'pre_option_' . $option, array( $this, 'backfill_option' ), 10, 2 );
		}

		// Make sure renamed meta key is backfilled.
		add_filter( 'get_user_metadata', array( $this, 'backfill_usermeta' ), 10, 3 );

		// Extend the options that have removed items.
		add_filter( 'option_wpseo_titles', array( $this, 'extend_wpseo_titles' ), 10, 1 );
		add_filter( 'option_wpseo', array( $this, 'extend_wpseo' ), 10, 1 );
	}

	/**
	 * Extends the WPSEO option with the removed option values.
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

		$keys = array(
			'website_name',
			'alternate_website_name',
			'company_logo',
			'company_name',
			'company_or_person',
			'person_name'
		);

		foreach ( $keys as $key ) {
			$data[ $key ] = WPSEO_Options::get( $key );
		}

		// Ended running.
		$running = false;

		return $data;
	}

	/**
	 * Extends the WPSEO Title with removed attributes.
	 *
	 * @param array $data Data of the option.
	 *
	 * @return array Extended data.
	 */
	public function extend_wpseo_titles( $data ) {
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
	 * Backfills the options that have been removed with the current values.
	 *
	 * @param mixed  $value  Current value for the option/
	 * @param string $option Name of the option.
	 *
	 * @return array Option data.
	 */
	public function backfill_option( $value, $option ) {
		$output = array();
		foreach ( $this->lookup[ $option ] as $old_key => $new_key ) {
			$output[ $old_key ] = WPSEO_Options::get( $new_key );
		}

		if ( $option === 'wpseo_permalinks' ) {
			// Add defaults for completely removed settings in the option.
			$output = array_merge(
				$output,
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

		if ( $option === 'wpseo_xml' ) {
			// Add dynamic implementations for settings that are not in any option anymore.
			$output = array_merge(
				$output,
				array(
					'entries-per-page' => (int) apply_filters( 'wpseo_sitemap_entries_per_page', 1000 ),
					'excluded-posts'   => apply_filters( 'wpseo_exclude_from_sitemap_by_post_ids', array() ),
				)
			);
		}

		return $output;
	}

	/**
	 * Backfills removed user meta fields.
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
}
