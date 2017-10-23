<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class adds the Social tab to the Yoast SEO metabox and makes sure the settings are saved.
 */
class WPSEO_Social_Admin extends WPSEO_Metabox {

	/**
	 * @var array
	 */
	private $options;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->options = WPSEO_Options::get_option( 'wpseo_social' );
		self::translate_meta_boxes();
		add_filter( 'wpseo_save_metaboxes', array( $this, 'save_meta_boxes' ), 10, 1 );
		add_action( 'wpseo_save_compare_data', array( $this, 'og_data_compare' ), 10, 1 );
	}

	/**
	 * Translate text strings for use in the meta box
	 *
	 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
	 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
	 */
	public static function translate_meta_boxes() {
		/* translators: %s expands to the social network's name */
		$title_text       = __( 'If you don\'t want to use the post title for sharing the post on %s but instead want another title there, write it here.', 'wordpress-seo' );
		/* translators: %s expands to the social network's name */
		$description_text = __( 'If you don\'t want to use the meta description for sharing the post on %s but want another description there, write it here.', 'wordpress-seo' );
		/* translators: %s expands to the social network's name */
		$image_text       = __( 'If you want to override the image used on %s for this post, upload / choose an image or add the URL here.', 'wordpress-seo' );
		/* translators: %1$s expands to the social network, %2$s to the recommended image size */
		$image_size_text  = __( 'The recommended image size for %1$s is %2$s pixels.', 'wordpress-seo' );

		$options = WPSEO_Options::get_option( 'wpseo_social' );

		$social_networks = array(
			'opengraph'  => __( 'Facebook', 'wordpress-seo' ),
			'twitter'    => __( 'Twitter', 'wordpress-seo' ),
		);

		// Source: https://blog.bufferapp.com/ideal-image-sizes-social-media-posts.
		$recommended_image_sizes = array(
			/* translators: %1$s expands to the image recommended width, %2$s to its height. */
			'opengraph'   => sprintf( __( '%1$s by %2$s', 'wordpress-seo' ), '1200', '630' ), // Source: https://developers.facebook.com/docs/sharing/best-practices#images.
			/* translators: %1$s expands to the image recommended width, %2$s to its height. */
			'twitter'     => sprintf( __( '%1$s by %2$s', 'wordpress-seo' ), '1024', '512' ),
		);

		foreach ( $social_networks as $network => $label ) {
			if ( true === $options[ $network ] ) {
				/* translators: %s expands to the name of a social network. */
				self::$meta_fields['social'][ $network . '-title' ]['title']       = sprintf( __( '%s Title', 'wordpress-seo' ), $label );
				self::$meta_fields['social'][ $network . '-title' ]['description'] = sprintf( $title_text, $label );

				/* translators: %s expands to the name of a social network. */
				self::$meta_fields['social'][ $network . '-description' ]['title']       = sprintf( __( '%s Description', 'wordpress-seo' ), $label );
				self::$meta_fields['social'][ $network . '-description' ]['description'] = sprintf( $description_text, $label );

				/* translators: %s expands to the name of a social network. */
				self::$meta_fields['social'][ $network . '-image' ]['title']       = sprintf( __( '%s Image', 'wordpress-seo' ), $label );
				self::$meta_fields['social'][ $network . '-image' ]['description'] = sprintf( $image_text, $label ) . ' ' . sprintf( $image_size_text, $label, $recommended_image_sizes[ $network ] );
			}
		}
	}

	/**
	 * Returns the metabox section for the social settings.
	 *
	 * @return WPSEO_Metabox_Tab_Section
	 */
	public function get_meta_section() {
		$tabs = array();
		$social_meta_fields = $this->get_meta_field_defs( 'social' );
		$single = true;

		if ( $this->options['opengraph'] === true && $this->options['twitter'] === true ) {
			$single = null;
		}

		if ( $this->options['opengraph'] === true ) {
			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'facebook',
				$this->get_social_tab_content( 'opengraph', $social_meta_fields ),
				'<span class="screen-reader-text">' . __( 'Facebook / Open Graph metadata', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-facebook-alt"></span>',
				array(
					'link_aria_label' => __( 'Facebook / Open Graph metadata', 'wordpress-seo' ),
					'link_class'      => 'yoast-tooltip yoast-tooltip-se',
					'single'          => $single,
				)
			);
		}

		if ( $this->options['twitter'] === true ) {
			$tabs[] = new WPSEO_Metabox_Form_Tab(
				'twitter',
				$this->get_social_tab_content( 'twitter', $social_meta_fields ),
				'<span class="screen-reader-text">' . __( 'Twitter metadata', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-twitter"></span>',
				array(
					'link_aria_label' => __( 'Twitter metadata', 'wordpress-seo' ),
					'link_class'      => 'yoast-tooltip yoast-tooltip-se',
					'single'          => $single,
				)
			);
		}

		return new WPSEO_Metabox_Tab_Section(
			'social',
			'<span class="screen-reader-text">' . __( 'Social', 'wordpress-seo' ) . '</span><span class="dashicons dashicons-share"></span>',
			$tabs,
			array(
				'link_aria_label' => __( 'Social', 'wordpress-seo' ),
				'link_class'      => 'yoast-tooltip yoast-tooltip-e',
			)
		);
	}

	/**
	 * Generates the html for a social settings tab for one of the supported social media.
	 *
	 * @param string $medium can be 'opengraph' or 'twitter'.
	 * @param array  $meta_field_defs The social meta field definitions.
	 *
	 * @return string
	 */
	private function get_social_tab_content( $medium, $meta_field_defs ) {
		$field_names = array(
			$medium . '-title',
			$medium . '-description',
			$medium . '-image',
		);

		$tab_content = $this->get_premium_notice( $medium );

		foreach ( $field_names as $field_name ) {
			$tab_content .= $this->do_meta_box( $meta_field_defs[ $field_name ], $field_name );
		}

		return $tab_content;
	}

	/**
	 * Returns the Upgrade to Premium notice.
	 *
	 * @param string $network The social network.
	 * @return string The notice HTML on the free version, empty string on premium.
	 */
	public function get_premium_notice( $network ) {
		$features = new WPSEO_Features();
		if ( $features->is_premium() ) {
			return '';
		}

		$network_name = __( 'Facebook', 'wordpress-seo' );

		if ( 'twitter' === $network ) {
			$network_name = __( 'Twitter', 'wordpress-seo' );
		}

		return sprintf( "<div class='notice inline yoast-notice yoast-notice-go-premium'>
			<p>%s</p>
			<p><a href='%s' target='_blank'>%s</a></p>
		</div>",
			/* translators: %1$s expands to the social network's name, %2$s to Yoast SEO Premium. */
			sprintf( __( 'Do you want to preview what it will look like if people share this post on %1$s? You can, with %2$s.', 'wordpress-seo' ),
				$network_name,
				'<strong>Yoast SEO Premium</strong>'
			),
			WPSEO_Shortlinker::get( 'https://yoa.st/179' ),
			/* translators: %s expands to Yoast SEO Premium. */
			sprintf( 'Find out why you should upgrade to %s', 'Yoast SEO Premium' )
		);
	}

	/**
	 * Filter over the meta boxes to save, this function adds the Social meta boxes.
	 *
	 * @param   array $field_defs Array of metaboxes to save.
	 *
	 * @return  array
	 */
	public function save_meta_boxes( $field_defs ) {
		return array_merge( $field_defs, $this->get_meta_field_defs( 'social' ) );
	}

	/**
	 * This method will compare opengraph fields with the posted values.
	 *
	 * When fields are changed, the facebook cache will be purge.
	 *
	 * @param WP_Post $post Post instance.
	 */
	public function og_data_compare( $post ) {

		// Check if post data is available, if post_id is set and if original post_status is publish.
		// @codingStandardsIgnoreStart
		if (
			! empty( $_POST ) && ! empty( $post->ID ) && $post->post_status == 'publish' &&
			isset( $_POST['original_post_status'] ) && $_POST['original_post_status'] === 'publish'
		) {
			// @codingStandardsIgnoreEnd

			$fields_to_compare = array(
				'opengraph-title',
				'opengraph-description',
				'opengraph-image',
			);

			$reset_facebook_cache = false;

			foreach ( $fields_to_compare as $field_to_compare ) {
				$old_value = self::get_value( $field_to_compare, $post->ID );
				$new_value = self::get_post_value( self::$form_prefix . $field_to_compare );

				if ( $old_value !== $new_value ) {
					$reset_facebook_cache = true;
					break;
				}
			}
			unset( $field_to_compare, $old_value, $new_value );

			if ( $reset_facebook_cache ) {
				wp_remote_get(
					'https://graph.facebook.com/?id=' . get_permalink( $post->ID ) . '&scrape=true&method=post'
				);
			}
		}
	}


	/********************** DEPRECATED METHODS **********************/

	// @codeCoverageIgnoreStart
	/**
	 * Define the meta boxes for the Social tab
	 *
	 * @deprecated 1.5.0
	 * @deprecated use WPSEO_Meta::get_meta_field_defs()
	 * @see        WPSEO_Meta::get_meta_field_defs()
	 *
	 * @param string $post_type Optional post type string.
	 *
	 * @return    array    Array containing the meta boxes
	 */
	public function get_meta_boxes( $post_type = 'post' ) {
		_deprecated_function( __METHOD__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_meta_field_defs()' );

		return $this->get_meta_field_defs( 'social' );
	}

	/**
	 * @deprecated 3.0 Removed.
	 *
	 * @return string
	 */
	public function tab_header() {
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

		return '';
	}

	/**
	 * @deprecated 3.0 Removed.
	 *
	 * @return string
	 */
	public function tab_content() {
		_deprecated_function( __METHOD__, 'WPSEO 3.0' );

		return '';
	}
	// @codeCoverageIgnoreEnd
} /* End of class */
