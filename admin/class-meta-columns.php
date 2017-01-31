<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Meta_Columns
 */
class WPSEO_Meta_Columns {

	/**
	 * @var WPSEO_Metabox_Analysis_SEO
	 */
	private $analysis_seo;

	/**
	 * @var WPSEO_Metabox_Analysis_Readability
	 */
	private $analysis_readability;

	/**
	 * When page analysis is enabled, just initialize the hooks
	 */
	public function __construct() {
		if ( apply_filters( 'wpseo_use_page_analysis', true ) === true ) {
			add_action( 'admin_init', array( $this, 'setup_hooks' ) );
		}

		$this->analysis_seo = new WPSEO_Metabox_Analysis_SEO();
		$this->analysis_readability = new WPSEO_Metabox_Analysis_Readability();
	}

	/**
	 * Setting up the hooks
	 */
	public function setup_hooks() {
		$this->set_post_type_hooks();

		$options = WPSEO_Options::get_option( 'wpseo_titles' );

		if ( ! empty( $options['keyword-analysis-active'] ) ) {
			add_action( 'restrict_manage_posts', array( $this, 'posts_filter_dropdown' ) );
		}

		add_filter( 'request', array( $this, 'column_sort_orderby' ) );
	}

	/**
	 * Adds the column headings for the SEO plugin for edit posts / pages overview
	 *
	 * @param array $columns Already existing columns.
	 *
	 * @return array
	 */
	public function column_heading( $columns ) {
		if ( $this->is_metabox_hidden() === true ) {
			return $columns;
		}

		$added_columns = array();

		if ( $this->analysis_seo->is_enabled() ) {
			$added_columns['wpseo-score'] = __( 'SEO', 'wordpress-seo' );
		}
		if ( $this->analysis_readability->is_enabled() ) {
			$added_columns['wpseo-score-readability'] = __( 'Readability', 'wordpress-seo' );
		}
		$added_columns['wpseo-title']    = __( 'SEO Title', 'wordpress-seo' );
		$added_columns['wpseo-metadesc'] = __( 'Meta Desc.', 'wordpress-seo' );

		if ( $this->analysis_seo->is_enabled() ) {
			$added_columns['wpseo-focuskw']  = __( 'Focus KW', 'wordpress-seo' );
		}

		return array_merge( $columns, $added_columns );
	}

	/**
	 * Display the column content for the given column
	 *
	 * @param string $column_name Column to display the content for.
	 * @param int    $post_id     Post to display the column content for.
	 */
	public function column_content( $column_name, $post_id ) {
		if ( $this->is_metabox_hidden() === true ) {
			return;
		}

		switch ( $column_name ) {
			case 'wpseo-score' :
				echo $this->parse_column_score( $post_id );
				break;
			case 'wpseo-score-readability':
				echo $this->parse_column_score_readability( $post_id );
				break;
			case 'wpseo-title' :
				echo esc_html( apply_filters( 'wpseo_title', wpseo_replace_vars( $this->page_title( $post_id ), get_post( $post_id, ARRAY_A ) ) ) );
				break;
			case 'wpseo-metadesc' :
				$metadesc_val = apply_filters( 'wpseo_metadesc', wpseo_replace_vars( WPSEO_Meta::get_value( 'metadesc', $post_id ), get_post( $post_id, ARRAY_A ) ) );
				$metadesc = ( '' === $metadesc_val ) ? '<span aria-hidden="true">&#8212;</span><span class="screen-reader-text">' . __( 'Meta description not set.', 'wordpress-seo' ) . '</span>' : esc_html( $metadesc_val );
				echo $metadesc;
				break;
			case 'wpseo-focuskw' :
				$focuskw_val = WPSEO_Meta::get_value( 'focuskw', $post_id );
				$focuskw = ( '' === $focuskw_val ) ? '<span aria-hidden="true">&#8212;</span><span class="screen-reader-text">' . __( 'Focus keyword not set.', 'wordpress-seo' ) . '</span>' : esc_html( $focuskw_val );
				echo $focuskw;
				break;
		}
	}

	/**
	 * Indicate which of the SEO columns are sortable.
	 *
	 * @param array $columns appended with their orderby variable.
	 *
	 * @return array
	 */
	public function column_sort( $columns ) {
		if ( $this->is_metabox_hidden() === true ) {
			return $columns;
		}

		$columns['wpseo-metadesc'] = 'wpseo-metadesc';

		if ( $this->analysis_seo->is_enabled() ) {
			$columns['wpseo-focuskw'] = 'wpseo-focuskw';
		}

		return $columns;
	}

	/**
	 * Hide the SEO Title, Meta Desc and Focus KW columns if the user hasn't chosen which columns to hide
	 *
	 * @param array|false $result The hidden columns.
	 * @param string      $option The option name used to set which columns should be hidden.
	 * @param WP_User     $user The User.
	 *
	 * @return array|false $result
	 */
	public function column_hidden( $result, $option, $user ) {
		global $wpdb;

		$prefix = $wpdb->get_blog_prefix();
		if ( ! $user->has_prop( $prefix . $option ) && ! $user->has_prop( $option ) ) {

			if ( ! is_array( $result ) ) {
				$result = array();
			}

			array_push( $result, 'wpseo-title', 'wpseo-metadesc' );

			if ( $this->analysis_seo->is_enabled() ) {
				array_push( $result, 'wpseo-focuskw' );
			}
		}

		return $result;
	}

	/**
	 * Adds a dropdown that allows filtering on the posts SEO Quality.
	 *
	 * @return void
	 */
	public function posts_filter_dropdown() {
		if ( $GLOBALS['pagenow'] === 'upload.php' || $this->is_metabox_hidden() === true ) {
			return;
		}

		$ranks = WPSEO_Rank::get_all_ranks();
		$current_seo_filter = filter_input( INPUT_GET, 'seo_filter' );

		echo '
			<label class="screen-reader-text" for="wpseo-filter">' . __( 'Filter by SEO Score', 'wordpress-seo' ) . '</label>
			<select name="seo_filter" id="wpseo-filter">
				<option value="">', __( 'All SEO Scores', 'wordpress-seo' ), '</option>';
		foreach ( $ranks as $rank ) {
			$sel = selected( $current_seo_filter, $rank->get_rank(), false );
			echo '
				<option ', $sel, 'value="', $rank->get_rank(), '">', $rank->get_drop_down_label(), '</option>';
		}
		echo '
			</select>';
	}

	/**
	 * Modify the query based on the seo_filter variable in $_GET
	 *
	 * @param array $vars Query variables.
	 *
	 * @return array
	 */
	public function column_sort_orderby( $vars ) {
		if ( $seo_filter = filter_input( INPUT_GET, 'seo_filter' ) ) {
			$rank = new WPSEO_Rank( $seo_filter );

			if ( WPSEO_Rank::NO_FOCUS === $seo_filter || WPSEO_Rank::NO_INDEX === $seo_filter ) {
				$vars = $this->filter_other( $vars, $seo_filter );
			}
			else {
				$vars = array_merge( $vars, $this->filter_scored( $rank->get_starting_score(), $rank->get_end_score() ) );
			}
		}

		if ( $seo_kw_filter = filter_input( INPUT_GET, 'seo_kw_filter' ) ) {
			$vars = array_merge(
				$vars, array(
					'post_type'  => get_query_var( 'post_type', 'post' ),
					'meta_key'   => WPSEO_Meta::$meta_prefix . 'focuskw',
					'meta_value' => sanitize_text_field( $seo_kw_filter ),
				)
			);
		}

		if ( isset( $vars['orderby'] ) ) {
			$vars = array_merge( $vars,  $this->filter_order_by( $vars['orderby'] ) );
		}

		return $vars;
	}

	/**
	 * When there is a score just return this meta query array
	 *
	 * @param string $low The lowest number in the score range.
	 * @param string $high The highest number in the score range.
	 *
	 * @return array
	 */
	private function filter_scored( $low, $high ) {
		/**
		 * @internal DON'T touch the order of these without double-checking/adjusting the seo_score_posts_where() method below!
		 */
		return array(
			'meta_query' => array(
				'relation' => 'AND',
				array(
					'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
					'value'   => array( $low, $high ),
					'type'    => 'numeric',
					'compare' => 'BETWEEN',
				),
				array(
					'relation' => 'OR',
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'compare' => 'NOT EXISTS',
					),
					array(
						'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
						'value'   => '1',
						'compare' => '!=',
					),
				),
			),
		);
	}

	/**
	 * Get vars for noindex or na filters
	 *
	 * @param array  $vars The unmerged vars.
	 * @param string $seo_filter The SEO filter.
	 *
	 * @return array
	 */
	private function filter_other( $vars, $seo_filter ) {
		switch ( $seo_filter ) {
			case 'noindex':
				$vars = array_merge(
					$vars,
					array(
						'meta_query' => array(
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
								'value'   => '1',
								'compare' => '=',
							),
						),
					)
				);
				break;
			case 'na':
				$vars = array_merge(
					$vars,
					array(
						'meta_query' => array(
							'relation' => 'AND',
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'meta-robots-noindex',
								'value'   => 'needs-a-value-anyway',
								'compare' => 'NOT EXISTS',
							),
							array(
								'key'     => WPSEO_Meta::$meta_prefix . 'linkdex',
								'value'   => 'needs-a-value-anyway',
								'compare' => 'NOT EXISTS',
							)
						),
					)
				);
				break;
		}

		return $vars;
	}

	/**
	 * Returning filters when $order_by is matched in the if-statement
	 *
	 * @param string $order_by The ID of the column by which to order the posts.
	 *
	 * @return array
	 */
	private function filter_order_by( $order_by ) {
		switch ( $order_by ) {
			case 'wpseo-metadesc' :
				return  array(
					'meta_key' => WPSEO_Meta::$meta_prefix . 'metadesc',
					'orderby'  => 'meta_value',
				);
				break;
			case 'wpseo-focuskw' :
				return array(
					'meta_key' => WPSEO_Meta::$meta_prefix . 'focuskw',
					'orderby'  => 'meta_value',
				);
				break;
		}

		return array();
	}

	/**
	 * Parsing the score column
	 *
	 * @param integer $post_id The ID of the post for which to show the score.
	 *
	 * @return string The HTML for the SEO score indicator.
	 */
	private function parse_column_score( $post_id ) {
		if ( '1' === WPSEO_Meta::get_value( 'meta-robots-noindex', $post_id ) ) {
			$rank  = new WPSEO_Rank( WPSEO_Rank::NO_INDEX );
			$title = __( 'Post is set to noindex.', 'wordpress-seo' );
			WPSEO_Meta::set_value( 'linkdex', 0, $post_id );
		}
		elseif ( '' === WPSEO_Meta::get_value( 'focuskw', $post_id ) ) {
			$rank  = new WPSEO_Rank( WPSEO_Rank::NO_FOCUS );
			$title = __( 'Focus keyword not set.', 'wordpress-seo' );
		}
		else {
			$score = (int) WPSEO_Meta::get_value( 'linkdex', $post_id );
			$rank  = WPSEO_Rank::from_numeric_score( $score );
			$title = $rank->get_label();
		}

		return $this->render_score_indicator( $rank, $title );
	}

	/**
	 * Parsing the readability score column.
	 *
	 * @param int $post_id The ID of the post for which to show the readability score.
	 *
	 * @return string The HTML for the readability score indicator.
	 */
	private function parse_column_score_readability( $post_id ) {
		$score = (int) WPSEO_Meta::get_value( 'content_score', $post_id );
		$rank = WPSEO_Rank::from_numeric_score( $score );

		return $this->render_score_indicator( $rank );
	}

	/**
	 * Setting the hooks for the post_types
	 */
	private function set_post_type_hooks() {
		$post_types = get_post_types( array( 'public' => true ), 'names' );

		if ( is_array( $post_types ) && $post_types !== array() ) {
			foreach ( $post_types as $pt ) {
				if ( $this->is_metabox_hidden( $pt ) === false ) {
					add_filter( 'manage_' . $pt . '_posts_columns', array( $this, 'column_heading' ), 10, 1 );
					add_action( 'manage_' . $pt . '_posts_custom_column', array(
						$this,
						'column_content',
					), 10, 2 );
					add_action( 'manage_edit-' . $pt . '_sortable_columns', array(
						$this,
						'column_sort',
					), 10, 2 );

					/*
					 * Use the `get_user_option_{$option}` filter to change the output of the get_user_option
					 * function for the `manage{$screen}columnshidden` option, which is based on the current
					 * admin screen. The admin screen we want to target is the `edit-{$post_type}` screen.
					 */
					$filter = sprintf( 'get_user_option_%s', sprintf( 'manage%scolumnshidden', 'edit-' . $pt ) );
					add_filter( $filter, array( $this, 'column_hidden' ), 10, 3 );
				}
			}
			unset( $pt );
		}
	}

	/**
	 * Test whether the metabox should be hidden either by choice of the admin or because
	 * the post type is not a public post type
	 *
	 * @since 1.5.0
	 *
	 * @param  string $post_type (optional) The post type to test, defaults to the current post post_type.
	 *
	 * @return  bool        Whether or not the meta box (and associated columns etc) should be hidden
	 */
	private function is_metabox_hidden( $post_type = null ) {
		if ( ! isset( $post_type ) &&  $get_post_type = filter_input( INPUT_GET, 'post_type' ) ) {
			$post_type = sanitize_text_field( $get_post_type );
		}

		if ( isset( $post_type ) ) {
			// Don't make static as post_types may still be added during the run.
			$cpts    = get_post_types( array( 'public' => true ), 'names' );
			$options = get_option( 'wpseo_titles' );

			return ( ( isset( $options[ 'hideeditbox-' . $post_type ] ) && $options[ 'hideeditbox-' . $post_type ] === true ) || in_array( $post_type, $cpts ) === false );
		}

		return false;
	}

	/**
	 * Retrieve the page title.
	 *
	 * @param int $post_id Post to retrieve the title for.
	 *
	 * @return string
	 */
	private function page_title( $post_id ) {
		$fixed_title = WPSEO_Meta::get_value( 'title', $post_id );
		if ( $fixed_title !== '' ) {
			return $fixed_title;
		}

		$post    = get_post( $post_id );
		$options = WPSEO_Options::get_option( 'wpseo_titles' );
		if ( is_object( $post ) && ( isset( $options[ 'title-' . $post->post_type ] ) && $options[ 'title-' . $post->post_type ] !== '' ) ) {
			$title_template = $options[ 'title-' . $post->post_type ];
			$title_template = str_replace( ' %%page%% ', ' ', $title_template );

			return wpseo_replace_vars( $title_template, $post );
		}

		return wpseo_replace_vars( '%%title%%', $post );
	}

	/**
	 * @param WPSEO_Rank $rank The rank this indicator should have.
	 * @param string     $title Optional. The title for this rank, defaults to the title of the rank.
	 *
	 * @return string The HTML for a score indicator.
	 */
	private function render_score_indicator( $rank, $title = '' ) {
		if ( empty( $title ) ) {
			$title = $rank->get_label();
		}

		return '<div aria-hidden="true" title="' . esc_attr( $title ) . '" class="wpseo-score-icon ' . esc_attr( $rank->get_css_class() ) . '"></div><span class="screen-reader-text">' . $title . '</span>';
	}

	/**
	 * Hacky way to get round the limitation that you can only have AND *or* OR relationship between
	 * meta key clauses and not a combination - which is what we need.
	 *
	 * @deprecated 3.5 Unnecessary with nested meta queries in core.
	 * @codeCoverageIgnore
	 *
	 * @param    string $where Where clause.
	 *
	 * @return    string
	 */
	public function seo_score_posts_where( $where ) {

		_deprecated_function( __METHOD__, '3.5' );

		global $wpdb;

		/* Find the two mutually exclusive noindex clauses which should be changed from AND to OR relation */
		$find = '`([\s]+AND[\s]+)((?:' . $wpdb->prefix . 'postmeta|mt[0-9]|mt1)\.post_id IS NULL[\s]+)AND([\s]+\([\s]*(?:' . $wpdb->prefix . 'postmeta|mt[0-9])\.meta_key = \'' . WPSEO_Meta::$meta_prefix . 'meta-robots-noindex\' AND CAST\([^\)]+\)[^\)]+\))`';

		$replace = '$1( $2OR$3 )';

		$new_where = preg_replace( $find, $replace, $where );

		if ( $new_where ) {
			return $new_where;
		}
		return $where;
	}
}
