<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Bulk_List_Table' ) ) {
	/**
	 *
	 */
	class WPSEO_Bulk_List_Table extends WP_List_Table {

		/*
		 * Array of post types for which the current user has `edit_others_posts` capabilities.
		 */
		private $all_posts;

		/*
		 * Array of post types for which the current user has `edit_posts` capabilities, but not `edit_others_posts`.
		 */
		private $own_posts;

		/**
		 * Saves all the metadata into this array.
		 *
		 * @var array
		 */
		protected $meta_data = array();

		/**
		 * The current requested page_url
		 *
		 * @var string
		 */
		private $request_url;

		/**
		 * The current page (depending on $_GET['paged']) if current tab is for current page_type, else it will be 1
		 *
		 * @var integer
		 */
		private $current_page;

		/**
		 * The current post filter, if is used (depending on $_GET['post_type_filter'])
		 *
		 * @var string
		 */
		private $current_filter;

		/**
		 * The current post status, if is used (depending on $_GET['post_status'])
		 *
		 * @var string
		 */
		private $current_status;

		/**
		 * The current sorting, if used (depending on $_GET['order'] and $_GET['orderby'])
		 *
		 * @var string
		 */
		private $current_order;

		/**
		 * The page_type for current class instance (for example: title / description).
		 *
		 * @var string
		 */
		protected $page_type;

		/**
		 * Based on the page_type ($this->page_type) there will be constructed an url part, for subpages and
		 * navigation
		 *
		 * @var string
		 */
		protected $page_url;

		/**
		 * The settings which will be used in the __construct.
		 * @var
		 */
		protected $settings;

		/**
		 * Class constructor
		 */
		function __construct() {
			parent::__construct( $this->settings );

			$this->request_url    = $_SERVER['REQUEST_URI'];
			$this->current_page   = ( ! empty( $_GET['paged'] ) ) ? $_GET['paged'] : 1;
			$this->current_filter = ( ! empty( $_GET['post_type_filter'] ) ) ? $_GET['post_type_filter'] : 1;
			$this->current_status = ( ! empty( $_GET['post_status'] ) ) ? $_GET['post_status'] : 1;
			$this->current_order  = array(
				'order'   => ( ! empty( $_GET['order'] ) ) ? $_GET['order'] : 'asc',
				'orderby' => ( ! empty( $_GET['orderby'] ) ) ? $_GET['orderby'] : 'post_title',
			);
			$this->page_url       = "&type={$this->page_type}#top#{$this->page_type}";

			$this->populate_editable_post_types();

		}

		/**
		 *    Used in the constructor to build a reference list of post types the current user can edit.
		 */
		protected function populate_editable_post_types() {
			$post_types = get_post_types( array( 'public' => true, 'exclude_from_search' => false ), 'object' );

			$this->all_posts = array();
			$this->own_posts = array();

			if ( is_array( $post_types ) && $post_types !== array() ) {
				foreach ( $post_types as $post_type ) {
					if ( ! current_user_can( $post_type->cap->edit_posts ) ) {
						continue;
					}

					if ( current_user_can( $post_type->cap->edit_others_posts ) ) {
						$this->all_posts[] = esc_sql( $post_type->name );
					} else {
						$this->own_posts[] = esc_sql( $post_type->name );
					}
				}
			}
		}


		/**
		 * Will shown the navigation for the table like pagenavigation and pagefilter;
		 *
		 *
		 * @param $which
		 */
		function display_tablenav( $which ) {
			$post_status = '';
			if ( ! empty( $_GET['post_status'] ) ) {
				$post_status = sanitize_text_field( $_GET['post_status'] );
			}
			?>
			<div class="tablenav <?php echo esc_attr( $which ); ?>">

				<?php if ( 'top' === $which ) { ?>
				<form id="posts-filter" action="" method="get">
					<input type="hidden" name="page" value="wpseo_bulk-editor" />
					<input type="hidden" name="type" value="<?php echo $this->page_type; ?>" />
					<input type="hidden" name="orderby" value="<?php echo $_GET['orderby']; ?>" />
					<input type="hidden" name="order" value="<?php echo $_GET['order']; ?>" />
					<input type="hidden" name="post_type_filter" value="<?php echo $_GET['post_type_filter']; ?>" />
					<?php if ( ! empty( $post_status ) ) { ?>
						<input type="hidden" name="post_status" value="<?php echo esc_attr( $post_status ); ?>" />
					<?php } ?>
					<?php } ?>

					<?php
					$this->extra_tablenav( $which );
					$this->pagination( $which );
					?>

					<br class="clear" />
					<?php if ( 'top' === $which ) { ?>
				</form>
			<?php } ?>
			</div>

		<?php
		}

		/**
		 * This function builds the base sql subquery used in this class.
		 *
		 * This function takes into account the post types in which the current user can
		 * edit all posts, and the ones the current user can only edit his/her own.
		 *
		 * @return string $subquery The subquery, which should always be used in $wpdb->prepare(), passing the current user_id in as the first parameter.
		 */
		function get_base_subquery() {
			global $wpdb;

			$all_posts_string = "'" . implode( "', '", $this->all_posts ) . "'";
			$own_posts_string = "'" . implode( "', '", $this->own_posts ) . "'";

			$post_author = esc_sql( (int) get_current_user_id() );

			$subquery = "(
				SELECT *
				FROM {$wpdb->posts}
				WHERE post_type IN ({$all_posts_string})
				UNION ALL
				SELECT *
				FROM {$wpdb->posts}
				WHERE post_type IN ({$own_posts_string}) AND post_author = {$post_author}
			) sub_base";

			return $subquery;
		}


		/**
		 * @return array
		 */
		function get_views() {
			global $wpdb;

			$status_links = array();

			$states          = get_post_stati( array( 'show_in_admin_all_list' => true ) );
			$states['trash'] = 'trash';
			$states          = esc_sql( $states );
			$all_states      = "'" . implode( "', '", $states ) . "'";

			$subquery = $this->get_base_subquery();

			$total_posts = $wpdb->get_var(
				"
					SELECT COUNT(ID) FROM {$subquery}
					WHERE post_status IN ({$all_states})
				"
			);


			$class               = empty( $_GET['post_status'] ) ? ' class="current"' : '';
			$status_links['all'] = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_bulk-editor' . $this->page_url ) ) . '"' . $class . '>' . sprintf( _nx( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $total_posts, 'posts', 'wordpress-seo' ), number_format_i18n( $total_posts ) ) . '</a>';

			$post_stati = get_post_stati( array( 'show_in_admin_all_list' => true ), 'objects' );
			if ( is_array( $post_stati ) && $post_stati !== array() ) {
				foreach ( $post_stati as $status ) {

					$status_name = esc_sql( $status->name );

					$total = $wpdb->get_var(
						$wpdb->prepare(
							"
								SELECT COUNT(ID) FROM {$subquery}
								WHERE post_status = %s
							",
							$status_name
						)
					);

					if ( $total == 0 ) {
						continue;
					}

					$class = '';
					if ( isset( $_GET['post_status'] ) && $status_name == $_GET['post_status'] ) {
						$class = ' class="current"';
					}

					$status_links[$status_name] = '<a href="' . esc_url( add_query_arg( array( 'post_status' => $status_name ), admin_url( 'admin.php?page=wpseo_bulk-editor' . $this->page_url ) ) ) . '"' . $class . '>' . sprintf( translate_nooped_plural( $status->label_count, $total ), number_format_i18n( $total ) ) . '</a>';
				}
			}
			unset( $post_stati, $status, $status_name, $total, $class );

			$trashed_posts = $wpdb->get_var(
				"
					SELECT COUNT(ID) FROM {$subquery}
					WHERE post_status IN ('trash')
				"
			);

			$class                 = ( isset( $_GET['post_status'] ) && 'trash' == $_GET['post_status'] ) ? 'class="current"' : '';
			$status_links['trash'] = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_bulk-editor&post_status=trash' . $this->page_url ) ) . '"' . $class . '>' . sprintf( _nx( 'Trash <span class="count">(%s)</span>', 'Trash <span class="count">(%s)</span>', $trashed_posts, 'posts', 'wordpress-seo' ), number_format_i18n( $trashed_posts ) ) . '</a>';

			return $status_links;
		}


		/**
		 * @param $which
		 */
		function extra_tablenav( $which ) {

			if ( 'top' === $which ) {
				$post_types = get_post_types( array( 'public' => true, 'exclude_from_search' => false ) );

				if ( is_array( $post_types ) && $post_types !== array() ) {
					global $wpdb;

					echo '<div class="alignleft actions">';

					$post_types = esc_sql( $post_types );
					$post_types = "'" . implode( "', '", $post_types ) . "'";

					$states          = get_post_stati( array( 'show_in_admin_all_list' => true ) );
					$states['trash'] = 'trash';
					$states          = esc_sql( $states );
					$all_states      = "'" . implode( "', '", $states ) . "'";

					$subquery = $this->get_base_subquery();

					$post_types = $wpdb->get_results(
						"
							SELECT DISTINCT post_type FROM {$subquery}
							WHERE post_status IN ({$all_states})
							ORDER BY 'post_type' ASC
						"
					);

					$selected = ! empty( $_GET['post_type_filter'] ) ? sanitize_text_field( $_GET['post_type_filter'] ) : - 1;

					$options = '<option value="-1">Show All Post Types</option>';

					if ( is_array( $post_types ) && $post_types !== array() ) {
						foreach ( $post_types as $post_type ) {
							$obj = get_post_type_object( $post_type->post_type );
							$options .= sprintf( '<option value="%2$s" %3$s>%1$s</option>', $obj->labels->name, $post_type->post_type, selected( $selected, $post_type->post_type, false ) );
						}
					}

					echo sprintf( '<select name="post_type_filter">%1$s</select>', $options );
					submit_button( __( 'Filter', 'wordpress-seo' ), 'button', false, false, array( 'id' => 'post-query-submit' ) );
					echo '</div>';
				}
			} elseif ( 'bottom' === $which ) {

			}

		}

		/**
		 *
		 * @return array
		 */
		function get_sortable_columns() {
			return $sortable = array(
				'col_page_title' => array( 'post_title', true ),
				'col_post_type'  => array( 'post_type', false ),
				'col_post_date'  => array( 'post_date', false ),
			);
		}

		/**
		 * Sets the correct pagenumber and pageurl for the navigation
		 *
		 * @param string $page_type
		 */
		function prepare_page_navigation() {

			$request_url = $this->request_url . $this->page_url;

			$current_page   = $this->current_page;
			$current_filter = $this->current_filter;
			$current_status = $this->current_status;
			$current_order  = $this->current_order;

			// If current type doesn't compare with objects page_type, than we have to unset some vars in the requested url (which will be use for internal table urls)
			if ( $_GET['type'] != $this->page_type ) {
				$request_url = remove_query_arg( 'paged', $request_url ); // page will be set with value 1 below.
				$request_url = remove_query_arg( 'post_type_filter', $request_url );
				$request_url = remove_query_arg( 'post_status', $request_url );
				$request_url = remove_query_arg( 'orderby', $request_url );
				$request_url = remove_query_arg( 'order', $request_url );
				$request_url = add_query_arg( 'pages', 1, $request_url );

				$current_page   = 1;
				$current_filter = '-1';
				$current_status = '';
				$current_order  = array( 'orderby' => 'post_title', 'order' => 'asc' );

			}

			$_SERVER['REQUEST_URI'] = $request_url;

			$_GET['paged']                = $current_page;
			$_REQUEST['paged']            = $current_page;
			$_REQUEST['post_type_filter'] = $current_filter;
			$_GET['post_type_filter']     = $current_filter;
			$_GET['post_status']          = $current_status;
			$_GET['orderby']              = $current_order['orderby'];
			$_GET['order']                = $current_order['order'];

		}

		/**
		 * Preparing the requested pagerows and setting the needed variables
		 */
		function prepare_items() {
			global $wpdb;

			//	Filter Block

			$post_types       = null;
			$post_type_clause = '';

			if ( ! empty( $_GET['post_type_filter'] ) && get_post_type_object( sanitize_text_field( $_GET['post_type_filter'] ) ) ) {
				$post_types       = esc_sql( sanitize_text_field( $_GET['post_type_filter'] ) );
				$post_type_clause = "AND post_type IN ('{$post_types}')";
			}

			//	Order By block
			$orderby = ! empty( $_GET['orderby'] ) ? esc_sql( sanitize_text_field( $_GET['orderby'] ) ) : 'post_title';
			$order   = 'ASC';

			if ( ! empty( $_GET['order'] ) ) {
				$order = esc_sql( strtoupper( sanitize_text_field( $_GET['order'] ) ) );
			}

			$states          = get_post_stati( array( 'show_in_admin_all_list' => true ) );
			$states['trash'] = 'trash';

			if ( ! empty( $_GET['post_status'] ) ) {
				$requested_state = sanitize_text_field( $_GET['post_status'] );
				if ( in_array( $requested_state, $states ) ) {
					$states = array( $requested_state );
				}
			}

			$states     = esc_sql( $states );
			$all_states = "'" . implode( "', '", $states ) . "'";

			$subquery = $this->get_base_subquery();

			// Count the total number of needed items
			$total_items = $wpdb->get_var(
				"
					SELECT COUNT(ID)
					FROM {$subquery}
					WHERE post_status IN ({$all_states}) $post_type_clause
				"
			);

			// Get all needed results
			$query = "
				SELECT ID, post_title, post_type, post_status, post_modified, post_date
				FROM {$subquery}
				WHERE post_status IN ({$all_states}) $post_type_clause
				ORDER BY {$orderby} {$order}
				LIMIT %d,%d
			";

			$per_page = $this->get_items_per_page( 'wpseo_posts_per_page', 10 );

			$paged = ! empty( $_GET['paged'] ) ? esc_sql( sanitize_text_field( $_GET['paged'] ) ) : '';

			if ( empty( $paged ) || ! is_numeric( $paged ) || $paged <= 0 ) {
				$paged = 1;
			}

			$total_pages = ceil( $total_items / $per_page );

			$offset = ( $paged - 1 ) * $per_page;

			$this->set_pagination_args(
				array(
					'total_items' => $total_items,
					'total_pages' => $total_pages,
					'per_page'    => $per_page,
				)
			);

			$columns               = $this->get_columns();
			$hidden                = array();
			$sortable              = $this->get_sortable_columns();
			$this->_column_headers = array( $columns, $hidden, $sortable );

			$this->items = $wpdb->get_results(
				$wpdb->prepare(
					$query,
					$offset,
					$per_page
				)
			);

			// Get the metadata for the current items ($this->items)
			$this->get_meta_data();

		}

		/**
		 * Based on $this->items and the defined columns, the table rows will be displayed.
		 *
		 */
		function display_rows() {

			$records = $this->items;

			list( $columns, $hidden ) = $this->get_column_info();


			$date_format = get_option( 'date_format' );

			if ( ( is_array( $records ) && $records !== array() ) && ( is_array( $columns ) && $columns !== array() ) ) {
				foreach ( $records as $rec ) {

					// Fill meta data if exists in $this->meta_data
					$meta_data = ( ! empty( $this->meta_data[$rec->ID] ) ) ? $this->meta_data[$rec->ID] : array();

					echo '<tr id="record_' . $rec->ID . '">';

					foreach ( $columns as $column_name => $column_display_name ) {

						$class = sprintf( 'class="%1$s column-%1$s"', $column_name );
						$style = '';

						if ( in_array( $column_name, $hidden ) ) {
							$style = ' style="display:none;"';
						}

						$attributes = $class . $style;

						switch ( $column_name ) {
							case 'col_page_title':
								echo sprintf( '<td %2$s><strong>%1$s</strong>', stripslashes( $rec->post_title ), $attributes );

								$post_type_object = get_post_type_object( $rec->post_type );
								$can_edit_post    = current_user_can( $post_type_object->cap->edit_post, $rec->ID );

								$actions = array();

								if ( $can_edit_post && 'trash' != $rec->post_status ) {
									$actions['edit'] = '<a href="' . esc_url( get_edit_post_link( $rec->ID, true ) ) . '" title="' . esc_attr( __( 'Edit this item', 'wordpress-seo' ) ) . '">' . __( 'Edit', 'wordpress-seo' ) . '</a>';
								}

								if ( $post_type_object->public ) {
									if ( in_array( $rec->post_status, array( 'pending', 'draft', 'future' ) ) ) {
										if ( $can_edit_post ) {
											$actions['view'] = '<a href="' . esc_url( add_query_arg( 'preview', 'true', get_permalink( $rec->ID ) ) ) . '" title="' . esc_attr( sprintf( __( 'Preview &#8220;%s&#8221;', 'wordpress-seo' ), $rec->post_title ) ) . '">' . __( 'Preview', 'wordpress-seo' ) . '</a>';
										}
									} elseif ( 'trash' != $rec->post_status ) {
										$actions['view'] = '<a href="' . esc_url( get_permalink( $rec->ID ) ) . '" title="' . esc_attr( sprintf( __( 'View &#8220;%s&#8221;', 'wordpress-seo' ), $rec->post_title ) ) . '" rel="bookmark">' . __( 'View', 'wordpress-seo' ) . '</a>';
									}
								}

								echo $this->row_actions( $actions );
								echo '</td>';
								break;

							case 'col_page_slug':
								$permalink    = get_permalink( $rec->ID );
								$display_slug = str_replace( get_bloginfo( 'url' ), '', $permalink );
								echo sprintf( '<td %2$s><a href="%3$s" target="_blank">%1$s</a></td>', stripslashes( $display_slug ), $attributes, esc_url( $permalink ) );
								break;

							case 'col_post_type':
								$post_type = get_post_type_object( $rec->post_type );
								echo sprintf( '<td %2$s>%1$s</td>', $post_type->labels->singular_name, $attributes );
								break;

							case 'col_post_status':
								$post_status = get_post_status_object( $rec->post_status );
								echo sprintf( '<td %2$s>%1$s</td>', $post_status->label, $attributes );
								break;

							case 'col_post_date':
								$cell_value = date_i18n( $date_format, strtotime( $rec->post_date ) );
								echo sprintf( '<td %2$s>%1$s</td>', $cell_value, $attributes );
								break;

							case 'col_existing_yoast_seo_title':
								$cell_value = ( ( ! empty( $meta_data[WPSEO_Meta::$meta_prefix . 'title'] ) ) ? $meta_data[WPSEO_Meta::$meta_prefix . 'title'] : '' );
								echo sprintf( '<td %2$s id="wpseo-existing-title-%3$s">%1$s</td>', $cell_value, $attributes, $rec->ID );
								break;

							case 'col_new_yoast_seo_title':
								$input = sprintf( '<input type="text" id="%1$s" name="%1$s" class="wpseo-new-title" data-id="%2$s" />', 'wpseo-new-title-' . $rec->ID, $rec->ID );
								echo sprintf( '<td %2$s>%1$s</td>', $input, $attributes );
								break;

							case 'col_new_yoast_seo_metadesc' :
								$input = sprintf( '<textarea id="%1$s" name="%1$s" class="wpseo-new-metadesc" data-id="%2$s"></textarea>', 'wpseo-new-metadesc-' . $rec->ID, $rec->ID );
								echo sprintf( '<td %2$s>%1$s</td>', $input, $attributes );
								break;


							case 'col_existing_yoast_seo_metadesc':
								$cell_value = ( ( ! empty( $meta_data[WPSEO_Meta::$meta_prefix . 'metadesc'] ) ) ? $meta_data[WPSEO_Meta::$meta_prefix . 'metadesc'] : '' );
								echo sprintf( '<td %2$s id="wpseo-existing-metadesc-%3$s">%1$s</td>', $cell_value, $attributes, $rec->ID );
								break;

							case 'col_row_action':
								$actions = sprintf( '<a href="#" class="wpseo-save" data-id="%1$s">Save</a> | <a href="#" class="wpseo-save-all">Save All</a>', $rec->ID );
								echo sprintf( '<td %2$s>%1$s</td>', $actions, $attributes );
								break;
						}
					}

					echo '</tr>';
				}
			}
		}
	} /* End of class */
} /* End of class-exists wrapper */
