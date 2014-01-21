<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Bulk_Description_List_Table' ) ) {
	/**
	 *
	 */
	class WPSEO_Bulk_Description_List_Table extends WP_List_Table {

		/*
		 * Array of post types for which the current user has `edit_others_posts` capabilities.
		 */
		private $all_posts;

		/*
		 * Array of post types for which the current user has `edit_posts` capabilities, but not `edit_others_posts`.
		 */
		private $own_posts;

		/**
		 *
		 */
		function __construct() {
			parent::__construct(
				array(
					'singular' => 'wpseo_bulk_description',
					'plural'   => 'wpseo_bulk_descriptions',
					'ajax'     => true,
				)
			);

			$this->populate_editable_post_types();
			
		}

		/*
		 *	Used in the constructor to build a reference list of post types the current user can edit.
		 */
		private function populate_editable_post_types() {
			$post_types = get_post_types( array( 'public' => true, 'exclude_from_search' => false ), 'object' );

			$this->all_posts = array();
			$this->own_posts = array();

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


		/**
		 * @param $which
		 */
		function display_tablenav( $which ) {
			?>
			<div class="tablenav <?php echo esc_attr( $which ); ?>">

				<?php if ( 'top' === $which ) { ?>
				<form id="posts-filter" action="" method="get">
					<input type="hidden" name="page" value="wpseo_bulk-description-editor" />
					<?php if ( ! empty( $_GET['post_status'] ) ) {?>
						<input type="hidden" name="post_status" value="<?php echo esc_attr( $_GET['post_status'] ); ?>" />
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

		/*
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

			$subquery = "(
				SELECT *
				FROM {$wpdb->posts}
				WHERE post_type IN ({$all_posts_string})
				UNION ALL
				SELECT *
				FROM {$wpdb->posts}
				WHERE post_type IN ({$own_posts_string}) AND post_author = %d
			)sub_base";
	
			return $subquery;
		}


		/**
		 * @return array
		 */
		function get_views() {
			global $wpdb;


			$status_links = array();

			$post_types = get_post_types( array( 'public' => true, 'exclude_from_search' => false ) );
			$post_types = esc_sql( $post_types );
			$post_types = "'" . implode( "', '", $post_types ) . "'";

			$states          = get_post_stati( array( 'show_in_admin_all_list' => true ) );
			$states['trash'] = 'trash';
			$states          = esc_sql( $states );
			$all_states      = "'" . implode( "', '", $states ) . "'";

			$total_posts = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->posts WHERE post_status IN ($all_states) AND post_type IN ($post_types)" );


			$class               = empty( $_GET['post_status'] ) ? ' class="current"' : '';
			$status_links['all'] = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_bulk-description-editor' ) ) . '"' . $class . '>' . sprintf( _nx( 'All <span class="count">(%s)</span>', 'All <span class="count">(%s)</span>', $total_posts, 'posts' ), number_format_i18n( $total_posts ) ) . '</a>';

			$post_stati = get_post_stati( array( 'show_in_admin_all_list' => true ), 'objects' );
			if ( is_array( $post_stati ) && $post_stati !== array() ) {
				foreach ( $post_stati as $status ) {

					$status_name = esc_sql( $status->name );

					$total = $wpdb->get_var( $wpdb->prepare(
						"
							SELECT COUNT(*)
							FROM $wpdb->posts
							WHERE post_status = %s AND post_type IN ($post_types)
						",
						$status_name
					) );

					if ( $total == 0 ) {
						continue;
					}

					$class = '';
					if ( isset( $_GET['post_status']) && $status_name == $_GET['post_status'] ) {
						$class = ' class="current"';
					}

					$status_links[ $status_name ] = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_bulk-description-editor&post_status=' . $status_name ) ) . '"' . $class . '>' . sprintf( translate_nooped_plural( $status->label_count, $total ), number_format_i18n( $total ) ) . '</a>';

				}
			}
			unset( $post_stati, $status, $status_name, $total, $class );

			$trashed_posts         = $wpdb->get_var( "SELECT COUNT(*) FROM $wpdb->posts WHERE post_status IN ('trash') AND post_type IN ($post_types)" );
			$class                 = ( isset( $_GET['post_status'] ) && 'trash' == $_GET['post_status'] ) ? 'class="current"' : '';
			$status_links['trash'] = '<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_bulk-description-editor&post_status=trash' ) ) . '"' . $class . '>' . sprintf( _nx( 'Trash <span class="count">(%s)</span>', 'Trash <span class="count">(%s)</span>', $trashed_posts, 'posts' ), number_format_i18n( $trashed_posts ) ) . '</a>';

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
					$states = esc_sql( $states );
					$all_states      = "'" . implode( "', '", $states ) . "'";

					$query      = "SELECT DISTINCT post_type FROM $wpdb->posts WHERE post_status IN ($all_states) AND post_type IN ($post_types) ORDER BY 'post_type' ASC";
					$post_types = $wpdb->get_results( $query );

					$selected = ! empty( $_GET['post_type_filter'] ) ? $_GET['post_type_filter'] : -1;

					$options = '<option value="-1">Show All Post Types</option>';

					foreach ( $post_types as $post_type ) {
						$obj      = get_post_type_object( $post_type->post_type );
						$options .= sprintf( '<option value="%2$s" %3$s>%1$s</option>', $obj->labels->name, $post_type->post_type, selected( $selected, $post_type->post_type, false ) );
					}

					echo sprintf( '<select name="post_type_filter">%1$s</select>' , $options );
					submit_button( __( 'Filter' ), 'button', false, false, array( 'id' => 'post-query-submit' ) );
					echo '</div>';
				}
			}
			else if ( 'bottom' === $which ) {

			}

		}


		/**
		 * @return array
		 */
		function get_columns() {
			return $columns = array(
				'col_page_title'                  => __( 'WP Page Title' ),
				'col_post_type'                   => __( 'Post Type' ),
				'col_post_status'                 => __( 'Post Status' ),
				'col_page_slug'                   => __( 'Page URL/Slug' ),
				'col_existing_yoast_seo_metadesc' => __( 'Existing Yoast Meta Description', 'wordpress-seo' ),
				'col_new_yoast_seo_metadesc'      => __( 'New Yoast Meta Description', 'wordpress-seo' ),
				'col_row_action'                  => __( 'Action' ),
			);
		}


		/**
		 * @return array
		 */
		function get_sortable_columns() {
			return $sortable = array(
				'col_page_title'                  => array( 'post_title', true ),
				'col_post_type'                   => array( 'post_type', false ),
				'col_existing_yoast_seo_metadesc' => array( 'meta_desc', false )
			);
		}
	
		function prepare_items() {
			global $wpdb;

			$query = "
				SELECT ID, post_title, post_type, meta_value AS meta_desc, post_status, post_modified
				FROM {$wpdb->posts}
				LEFT JOIN (
					SELECT *
					FROM {$wpdb->postmeta}
					WHERE meta_key = %1\$s
				)a ON a.post_id = {$wpdb->posts}.ID
				WHERE post_status IN (%2\$s) AND post_type IN (%3\$s)
				ORDER BY %4\$s %5\$s
			";

			//	Filter Block
	
			$post_types = get_post_types( array( 'exclude_from_search' => false ) );

			if ( ! empty( $_GET['post_type_filter'] ) && get_post_type_object( $_GET['post_type_filter'] ) ) {
				$post_types = array( $_GET['post_type_filter'] );
			}

			$post_types = esc_sql( $post_types );
			$post_types = "'" . implode( "', '", $post_types ) . "'";

			//	Order By block

			$orderby = ! empty( $_GET['orderby'] ) ? esc_sql( $_GET['orderby'] ) : 'post_title';
			$order   = 'ASC';

			if( ! empty( $_GET['order'] ) ) {
				$order = esc_sql( strtoupper( $_GET['order'] ) );
			}

			$states          = get_post_stati( array( 'show_in_admin_all_list' => true ) );
			$states['trash'] = 'trash';

			if ( ! empty( $_GET['post_status'] ) ) {
				$requested_state = $_GET['post_status'];
				if ( in_array( $requested_state, $states ) ) {
					$states = array( $requested_state );
				}
			}

			$states = esc_sql( $states );
			$all_states      = "'" . implode( "', '", $states ) . "'";

			$query = sprintf(
				$query,
				'%s',
				$all_states,
				$post_types,
				$orderby,
				$order
			);

			$total_items = $wpdb->query( $wpdb->prepare(
				$query,
				WPSEO_Meta::$meta_prefix . 'metadesc'
			) );

			$query .= ' LIMIT %d,%d';

			$per_page = $this->get_items_per_page( 'wpseo_posts_per_page', 10 );

			$paged = ! empty( $_GET['paged'] ) ? esc_sql( $_GET['paged'] ) : '';

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

			$this->items = $wpdb->get_results( $wpdb->prepare(
				$query,
				WPSEO_Meta::$meta_prefix . 'metadesc',
				$offset,
				$per_page
			) );

		}

		function display_rows() {

			$records = $this->items;

			list( $columns, $hidden ) = $this->get_column_info();

			if ( ( is_array( $records ) && $records !== array() ) && ( is_array( $columns ) && $columns !== array() ) ) {
				foreach ( $records as $rec ) {
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
									$actions['edit'] = '<a href="' . esc_url( get_edit_post_link( $rec->ID, true ) ) . '" title="' . esc_attr( __( 'Edit this item' ) ) . '">' . __( 'Edit' ) . '</a>';
								}

								if ( $post_type_object->public ) {
									if ( in_array( $rec->post_status, array( 'pending', 'draft', 'future' ) ) ) {
										if ( $can_edit_post )
											$actions['view'] = '<a href="' . esc_url( add_query_arg( 'preview', 'true', get_permalink( $rec->ID ) ) ) . '" title="' . esc_attr( sprintf( __( 'Preview &#8220;%s&#8221;' ), $rec->post_title ) ) . '">' . __( 'Preview' ) . '</a>';
									}
									else if ( 'trash' != $rec->post_status ) {
										$actions['view'] = '<a href="' . esc_url( get_permalink( $rec->ID ) ) . '" title="' . esc_attr( sprintf( __( 'View &#8220;%s&#8221;' ), $rec->post_title ) ) . '" rel="bookmark">' . __( 'View' ) . '</a>';
									}
								}

								echo $this->row_actions( $actions );

								echo '</td>';
								break;

							case 'col_page_slug':
								$permalink    = get_permalink( $rec->ID );
								$display_slug = str_replace( get_bloginfo( 'url' ), '', $permalink );
								echo sprintf( '<td %2$s><a href="%3$s" target="_blank">%1$s</a></td>', stripslashes( $display_slug ), $attributes, $permalink );
								break;

							case 'col_post_type':
								$post_type = get_post_type_object( $rec->post_type );
								echo sprintf( '<td %2$s>%1$s</td>', $post_type->labels->singular_name, $attributes );
								break;

							case 'col_post_status':
								$post_status = get_post_status_object( $rec->post_status );
								echo sprintf( '<td %2$s>%1$s</td>', $post_status->label, $attributes );
								break;

							case 'col_existing_yoast_seo_metadesc':
								echo sprintf( '<td %2$s id="wpseo-existing-metadesc-%3$s">%1$s</td>', ( ($rec->meta_desc ) ? $rec->meta_desc : '' ), $attributes, $rec->ID );
								break;

							case 'col_new_yoast_seo_metadesc':
								$input = sprintf( '<textarea id="%1$s" name="%1$s" class="wpseo-new-metadesc" data-id="%2$s"></textarea>', 'wpseo-new-metadesc-' . $rec->ID, $rec->ID );
								echo sprintf( '<td %2$s>%1$s</td>', $input , $attributes );
								break;

							case 'col_row_action':
								$actions = sprintf( '<a href="#" class="wpseo-save" data-id="%1$s">Save</a> | <a href="#" class="wpseo-save-all">Save All</a>', $rec->ID );
								echo sprintf( '<td %2$s>%1$s</td>', $actions , $attributes );
								break;
						}
					}

					echo '</tr>';
				}
			}
		}
	} /* End of class */
} /* End of class-exists wrapper */
