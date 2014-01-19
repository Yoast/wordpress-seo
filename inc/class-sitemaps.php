<?php
/**
 * @package XML_Sitemaps
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class WPSEO_Sitemaps
 */
class WPSEO_Sitemaps {
	/**
	 * Content of the sitemap to output.
	 */
	private $sitemap = '';

	/**
	 * XSL stylesheet for styling a sitemap for web browsers
	 */
	private $stylesheet = '';

	/**
	 *     Flag to indicate if this is an invalid or empty sitemap.
	 */
	public $bad_sitemap = false;

	/**
	 * The maximum number of entries per sitemap page
	 */
	private $max_entries = 1000;

	/**
	 * Holds the WP SEO
	 */
	private $options = array();

	/**
	 * Holds the n variable
	 */
	private $n = 1;

	/**
	 * Holds the home_url() value to speed up loops
	 * @var string $home_url
	 */
	private $home_url = '';

	/**
	 * Class constructor
	 */
	function __construct() {
		if ( ! defined( 'ENT_XML1' ) )
			define( "ENT_XML1", 16 );

		add_action( 'init', array( $this, 'init' ), 1 );
		add_action( 'template_redirect', array( $this, 'redirect' ) );
		add_filter( 'redirect_canonical', array( $this, 'canonical' ) );
		add_action( 'wpseo_hit_sitemap_index', array( $this, 'hit_sitemap_index' ) );

		// default stylesheet
		$this->stylesheet = '<?xml-stylesheet type="text/xsl" href="' . home_url( 'main-sitemap.xsl' ) . '"?>';

		$this->options = get_wpseo_options();

		$this->home_url = home_url();
	}

	/**
	 * Register your own sitemap. Call this during 'init'.
	 *
	 * @param string   $name     The name of the sitemap
	 * @param callback $function Function to build your sitemap
	 * @param string   $rewrite  Optional. Regular expression to match your sitemap with
	 */
	function register_sitemap( $name, $function, $rewrite = '' ) {
		add_action( 'wpseo_do_sitemap_' . $name, $function );
		if ( ! empty( $rewrite ) )
			add_rewrite_rule( $rewrite, 'index.php?sitemap=' . $name, 'top' );
	}

	/**
	 * Register your own XSL file. Call this during 'init'.
	 *
	 * @param string   $name     The name of the XSL file
	 * @param callback $function Function to build your XSL file
	 * @param string   $rewrite  Optional. Regular expression to match your sitemap with
	 */
	function register_xsl( $name, $function, $rewrite = '' ) {
		add_action( 'wpseo_xsl_' . $name, $function );
		if ( ! empty( $rewrite ) )
			add_rewrite_rule( $rewrite, 'index.php?xsl=' . $name, 'top' );
	}

	/**
	 * Set the sitemap content to display after you have generated it.
	 *
	 * @param string $sitemap The generated sitemap to output
	 */
	function set_sitemap( $sitemap ) {
		$this->sitemap = $sitemap;
	}

	/**
	 * Set a custom stylesheet for this sitemap. Set to empty to just remove
	 * the default stylesheet.
	 *
	 * @param string $stylesheet Full xml-stylesheet declaration
	 */
	function set_stylesheet( $stylesheet ) {
		$this->stylesheet = $stylesheet;
	}

	/**
	 * Set as true to make the request 404. Used stop the display of empty sitemaps or
	 * invalid requests.
	 *
	 * @param bool $bool Is this a bad request. True or false.
	 */
	function set_bad_sitemap( $bool ) {
		$this->bad_sitemap = (bool) $bool;
	}

	/**
	 * Initialize sitemaps. Add sitemap rewrite rules and query var
	 */
	function init() {
		if ( ! is_object( $GLOBALS['wp'] ) ) {
			return;
		}

		$GLOBALS['wp']->add_query_var( 'sitemap' );
		$GLOBALS['wp']->add_query_var( 'sitemap_n' );
		$GLOBALS['wp']->add_query_var( 'xsl' );

		$this->max_entries = ( isset( $this->options['entries-per-page'] ) && $this->options['entries-per-page'] != '' ) ? intval( $this->options['entries-per-page'] ) : 1000;

		add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
		add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
		add_rewrite_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?xsl=$matches[1]', 'top' );
	}

	/**
	 * Prevent stupid plugins from running shutdown scripts when we're obviously not outputting HTML.
	 *
	 * @since 1.4.16
	 */
	function sitemap_close() {
		global $wp_filter;
		$wp_filter['wp_footer'] = 1;
		die();
	}

	/**
	 * Hijack requests for potential sitemaps and XSL files.
	 */
	function redirect() {
		$xsl = get_query_var( 'xsl' );
		if ( ! empty( $xsl ) ) {
			$this->xsl_output( $xsl );
			$this->sitemap_close();
		}

		$type = get_query_var( 'sitemap' );
		if ( empty( $type ) )
			return;
			
		$n = get_query_var( 'sitemap_n' );
		if( is_scalar( $n ) && intval( $n ) > 0 ) {
			$this->n = intval( $n );
		}

		$this->build_sitemap( $type );
		// 404 for invalid or emtpy sitemaps
		if ( $this->bad_sitemap ) {
			$GLOBALS['wp_query']->is_404 = true;
			return;
		}

		$this->output();
		$this->sitemap_close();
	}

	/**
	 * Attempt to build the requested sitemap. Sets $bad_sitemap if this isn't
	 * for the root sitemap, a post type or taxonomy.
	 *
	 * @param string $type The requested sitemap's identifier.
	 */
	function build_sitemap( $type ) {

		$type = apply_filters( 'wpseo_build_sitemap_post_type', $type );

		if ( $type == 1 )
			$this->build_root_map();
		else if ( post_type_exists( $type ) )
			$this->build_post_type_map( $type );
		else if ( $tax = get_taxonomy( $type ) )
			$this->build_tax_map( $tax );
		else if ( $type == 'author' ) {
			$this->build_user_map();
		}
		else if ( has_action( 'wpseo_do_sitemap_' . $type ) )
			do_action( 'wpseo_do_sitemap_' . $type );
		else
			$this->bad_sitemap = true;
	}

	/**
	 * Build the root sitemap -- example.com/sitemap_index.xml -- which lists sub-sitemaps
	 * for other content types.
	 *
	 * @todo lastmod for sitemaps?
	 */

	function build_root_map() {

		global $wpdb;

		$this->sitemap = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
		$base          = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';

		// reference post type specific sitemaps
		foreach ( get_post_types( array( 'public' => true ) ) as $post_type ) {
			if ( isset( $this->options['post_types-' . $post_type . '-not_in_sitemap'] ) && $this->options['post_types-' . $post_type . '-not_in_sitemap'] )
				continue;
			else if ( apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type ) )
				continue;

			$query = $wpdb->prepare( "SELECT COUNT(ID) FROM $wpdb->posts WHERE post_type = '%s' AND post_status IN ('publish','inherit')", $post_type );

			$count = $wpdb->get_var( $query );
			// don't include post types with no posts
			if ( ! $count )
				continue;

			$n = ( $count > $this->max_entries ) ? (int) ceil( $count / $this->max_entries ) : 1;
			for ( $i = 0; $i < $n; $i ++ ) {
				$count = ( $n > 1 ) ? $i + 1 : '';

				if ( empty( $count ) || $count == $n ) {
					$date = $this->get_last_modified( $post_type );
				}
				else {
					$date = $wpdb->get_var( $wpdb->prepare( "SELECT post_modified_gmt FROM $wpdb->posts WHERE post_status IN ('publish','inherit') AND post_type = %s ORDER BY post_modified_gmt ASC LIMIT 1 OFFSET %d", $post_type, $this->max_entries * ( $i + 1 ) - 1 ) );
				}

				$date = date( 'c', strtotime( $date ) );

				$this->sitemap .= '<sitemap>' . "\n";
				$this->sitemap .= '<loc>' . home_url( $base . $post_type . '-sitemap' . $count . '.xml' ) . '</loc>' . "\n";
				$this->sitemap .= '<lastmod>' . htmlspecialchars( $date ) . '</lastmod>' . "\n";
				$this->sitemap .= '</sitemap>' . "\n";
			}
		}

		// reference taxonomy specific sitemaps
		foreach ( get_taxonomies( array( 'public' => true ) ) as $tax ) {
			if ( in_array( $tax, array( 'link_category', 'nav_menu', 'post_format' ) ) )
				continue;
			else if ( apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $tax ) )
				continue;

			if ( isset( $this->options['taxonomies-' . $tax . '-not_in_sitemap'] ) && $this->options['taxonomies-' . $tax . '-not_in_sitemap'] )
				continue;
			// don't include taxonomies with no terms
			if ( ! $wpdb->get_var( $wpdb->prepare( "SELECT term_id FROM $wpdb->term_taxonomy WHERE taxonomy = %s AND count != 0 LIMIT 1", $tax ) ) )
				continue;

			$steps     = $this->max_entries;
			$all_terms = get_terms( $tax, array( 'hide_empty' => true, 'fields' => 'names' ) );
			$count     = count( $all_terms );
			$n         = ( $count > $this->max_entries ) ? (int) ceil( $count / $this->max_entries ) : 1;

			for ( $i = 0; $i < $n; $i ++ ) {
				$count  = ( $n > 1 ) ? $i + 1 : '';
				$taxobj = get_taxonomy( $tax );

				if ( ( empty( $count ) || $count == $n ) && false ) {
					$date = $this->get_last_modified( $post_type );
				}
				else {
					$terms = array_splice( $all_terms, 0, $steps );
					if ( ! $terms )
						continue;

					$args  = array(
						'post_type' => $taxobj->object_type,
						'tax_query' => array(
							array(
								'taxonomy' => $tax,
								'field'    => 'slug',
								'terms'    => $terms
							)
						),
						'orderby'   => 'modified',
						'order'     => 'DESC',
					);
					$query = new WP_Query( $args );

					$date = '';
					if ( $query->have_posts() )
						$date = $query->posts[0]->post_modified_gmt;

				}

				// Retrieve the post_types that are registered to this taxonomy and then retrieve last modified date for all of those combined.
				// $taxobj = get_taxonomy( $tax );
				// $date   = $this->get_last_modified( $taxobj->object_type );
				$date = date( 'c', strtotime( $date ) );

				$this->sitemap .= '<sitemap>' . "\n";
				$this->sitemap .= '<loc>' . home_url( $base . $tax . '-sitemap' . $count . '.xml' ) . '</loc>' . "\n";
				$this->sitemap .= '<lastmod>' . htmlspecialchars( $date ) . '</lastmod>' . "\n";
				$this->sitemap .= '</sitemap>' . "\n";
			}
		}

		if ( ! isset( $this->options['disable-author'] ) && ! isset( $this->options['disable_author_sitemap'] ) ) {

			// reference user profile specific sitemaps
			$users = get_users( array( 'who' => 'authors', 'fields' => 'id' ) );

			$count = count( $users );
			$n     = ( $count > $this->max_entries ) ? (int) ceil( $count / $this->max_entries ) : 1;

			for ( $i = 0; $i < $n; $i ++ ) {
				$count = ( $n > 1 ) ? $i + 1 : '';

				// must use custom raw query because WP User Query does not support ordering by usermeta
				// Retrieve the newest updated profile timestamp overall
				if ( empty( $count ) || $count == $n ) {
					$date = $wpdb->get_var( $wpdb->prepare( "
					SELECT mt1.meta_value FROM $wpdb->users
					INNER JOIN $wpdb->usermeta ON ($wpdb->users.ID = $wpdb->usermeta.user_id)
					INNER JOIN $wpdb->usermeta AS mt1 ON ($wpdb->users.ID = mt1.user_id) WHERE 1=1 
					AND ( ($wpdb->usermeta.meta_key = %s AND CAST($wpdb->usermeta.meta_value AS CHAR) != '0')
					AND mt1.meta_key = '_yoast_wpseo_profile_updated' ) ORDER BY mt1.meta_value DESC LIMIT 1
					",
							$wpdb->get_blog_prefix() . 'user_level'
					) );
					$date = date( 'c', $date );

					// Retrieve the newest updated profile timestamp by an offset
				}
				else {
					$date = $wpdb->get_var( $wpdb->prepare( "
					SELECT mt1.meta_value FROM $wpdb->users
					INNER JOIN $wpdb->usermeta ON ($wpdb->users.ID = $wpdb->usermeta.user_id)
					INNER JOIN $wpdb->usermeta AS mt1 ON ($wpdb->users.ID = mt1.user_id) WHERE 1=1 
					AND ( ($wpdb->usermeta.meta_key = %s AND CAST($wpdb->usermeta.meta_value AS CHAR) != '0')
					AND mt1.meta_key = '_yoast_wpseo_profile_updated' ) ORDER BY mt1.meta_value ASC LIMIT 1 OFFSET %d
					",
							$wpdb->get_blog_prefix() . 'user_level',
							$this->max_entries * ( $i + 1 ) - 1 ) );
					$date = date( 'c', $date );
				}

				$this->sitemap .= '<sitemap>' . "\n";
				$this->sitemap .= '<loc>' . home_url( $base . 'author-sitemap' . $count . '.xml' ) . '</loc>' . "\n";
				$this->sitemap .= '<lastmod>' . htmlspecialchars( $date ) . '</lastmod>' . "\n";
				$this->sitemap .= '</sitemap>' . "\n";
			}
		}

		// allow other plugins to add their sitemaps to the index
		$this->sitemap .= apply_filters( 'wpseo_sitemap_index', '' );
		$this->sitemap .= '</sitemapindex>';
	}

	/**
	 * Build a sub-sitemap for a specific post type -- example.com/post_type-sitemap.xml
	 *
	 * @param string $post_type Registered post type's slug
	 */
	function build_post_type_map( $post_type ) {
		global $wpdb;

		if (
				( isset( $this->options['post_types-' . $post_type . '-not_in_sitemap'] ) && $this->options['post_types-' . $post_type . '-not_in_sitemap'] )
				|| in_array( $post_type, array( 'revision', 'nav_menu_item' ) )
				|| apply_filters( 'wpseo_sitemap_exclude_post_type', false, $post_type )
		) {
			$this->bad_sitemap = true;
			return;
		}

		$output = '';

		$steps  = ( 25 > $this->max_entries ) ? $this->max_entries : 25;
		$n      = (int) $this->n;
		$offset = ( $n > 1 ) ? ( $n - 1 ) * $this->max_entries : 0;
		$total  = $offset + $this->max_entries;

		$join_filter  = '';
		$join_filter  = apply_filters( 'wpseo_typecount_join', $join_filter, $post_type );
		$where_filter = '';
		$where_filter = apply_filters( 'wpseo_typecount_where', $where_filter, $post_type );

		$query     = $wpdb->prepare( "SELECT COUNT(ID) FROM $wpdb->posts {$join_filter} WHERE post_status IN ('publish','inherit') AND post_password = '' AND post_type = %s " . $where_filter, $post_type );

		$typecount = $wpdb->get_var( $query );

		if ( $total > $typecount )
			$total = $typecount;

		if ( $n == 1 ) {
			$front_id = get_option( 'page_on_front' );
			if ( ! $front_id && ( $post_type == 'post' || $post_type == 'page' ) ) {
				$output .= $this->sitemap_url( array(
					'loc' => $this->home_url,
					'pri' => 1,
					'chf' => 'daily',
				) );
			}
			else if ( $front_id && $post_type == 'post' ) {
				$page_for_posts = get_option( 'page_for_posts' );
				if ( $page_for_posts ) {
					$output .= $this->sitemap_url( array(
						'loc' => get_permalink( $page_for_posts ),
						'pri' => 1,
						'chf' => 'daily',
					) );
				}
			}

			if ( function_exists( 'get_post_type_archive_link' ) ) {
				$archive = get_post_type_archive_link( $post_type );
				if ( $archive ) {
					$output .= $this->sitemap_url( array(
						'loc' => $archive,
						'pri' => 0.8,
						'chf' => 'weekly',
						'mod' => $this->get_last_modified( $post_type ) // get_lastpostmodified( 'gmt', $post_type ) #17455
					) );
				}
			}
		}

		if ( $typecount == 0 && empty( $archive ) ) {
			$this->bad_sitemap = true;
			return;
		}

		$stackedurls = array();

		// Make sure you're wpdb->preparing everything you throw into this!!
		$join_filter  = apply_filters( 'wpseo_posts_join', false, $post_type );
		$where_filter = apply_filters( 'wpseo_posts_where', false, $post_type );

		$status = ( $post_type == 'attachment' ) ? 'inherit' : 'publish';

		// We grab post_date, post_name, post_author and post_status too so we can throw these objects into get_permalink, which saves a get_post call for each permalink.
		$i = 0;
		while ( $total > $offset ) {

			// Optimized query per this thread: http://wordpress.org/support/topic/plugin-wordpress-seo-by-yoast-performance-suggestion
			// Also see http://explainextended.com/2009/10/23/mysql-order-by-limit-performance-late-row-lookups/
			$query = $wpdb->prepare( "SELECT l.ID, post_content, post_name, post_author, post_parent, post_modified_gmt, post_date, post_date_gmt
				FROM (
					SELECT ID FROM $wpdb->posts {$join_filter}
						WHERE post_status = '%s'
						AND	post_password = ''
						AND post_type = '%s'
						{$where_filter}
						ORDER BY post_modified ASC
						LIMIT %d OFFSET %d ) o
					JOIN $wpdb->posts l
					ON l.ID = o.ID
					ORDER BY l.ID", $status, $post_type, $steps, $offset );

			$posts = $wpdb->get_results( $query );

			$offset = $offset + $steps;

			foreach ( $posts as $p ) {
				$p->post_type   = $post_type;
				$p->post_status = 'publish';
				$p->filter      = 'sample';

				if ( (int) wpseo_get_value( 'meta-robots-noindex', $p->ID ) === 1 && wpseo_get_value( 'sitemap-include', $p->ID ) != 'always' ) {
					continue;
				}
				if ( wpseo_get_value( 'sitemap-include', $p->ID ) == 'never' ) {
					continue;
				}
				if ( wpseo_get_value( 'redirect', $p->ID ) && strlen( wpseo_get_value( 'redirect', $p->ID ) ) > 0 ) {
					continue;
				}

				$url = array();

				$url['mod'] = ( isset( $p->post_modified_gmt ) && $p->post_modified_gmt != '0000-00-00 00:00:00' && $p->post_modified_gmt > $p->post_date_gmt ) ? $p->post_modified_gmt : $p->post_date_gmt;
				$url['chf'] = 'weekly';
				$url['loc'] = get_permalink( $p );

				/**
				 * Do not include external URLs.
				 * A plugin like http://wordpress.org/plugins/page-links-to/ can rewrite permalinks to external URLs.
				 */
				if ( false === strpos( $url['loc'], $this->home_url ) ) {
					continue;
				}

				$canonical = wpseo_get_value( 'canonical', $p->ID );
				if ( $canonical && $canonical != '' && $canonical != $url['loc'] ) {
					// Let's assume that if a canonical is set for this page and it's different from the URL of this post, that page is either
					// already in the XML sitemap OR is on an external site, either way, we shouldn't include it here.
					continue;
				}
				else {

					if ( isset( $this->options['trailingslash'] ) && $this->options['trailingslash'] && $p->post_type != 'post' )
						$url['loc'] = trailingslashit( $url['loc'] );
				}

				$pri = wpseo_get_value( 'sitemap-prio', $p->ID );
				if ( is_numeric( $pri ) )
					$url['pri'] = $pri;
				elseif ( $p->post_parent == 0 && $p->post_type == 'page' )
					$url['pri'] = 0.8;
				else
					$url['pri'] = 0.6;

				if ( isset( $front_id ) && $p->ID == $front_id )
					$url['pri'] = 1.0;

				$url['images'] = array();

				$content = $p->post_content;
				if ( function_exists( 'get_the_post_thumbnail' ) ) {
					$content = '<p>' . get_the_post_thumbnail( $p->ID, 'full' ) . '</p>' . $content;
				}

				$host = str_replace( 'www.', '', parse_url( get_bloginfo( 'url' ), PHP_URL_HOST ) );

				if ( preg_match_all( '`<img [^>]+>`', $content, $matches ) ) {
					foreach ( $matches[0] as $img ) {
						if ( preg_match( '`src=["\']([^"\']+)["\']`', $img, $match ) ) {
							$src = $match[1];
							if ( strpos( $src, 'http' ) !== 0 ) {
								if ( $src[0] != '/' )
									continue;
								$src = get_bloginfo( 'url' ) . $src;
							}

							if ( strpos( $src, $host ) === false )
								continue;

							if ( $src != esc_url( $src ) )
								continue;

							if ( isset( $url['images'][$src] ) )
								continue;

							$image = array(
								'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src, $p )
							);

							if ( preg_match( '`title=["\']([^"\']+)["\']`', $img, $match ) )
								$image['title'] = str_replace( array( '-', '_' ), ' ', $match[1] );

							if ( preg_match( '`alt=["\']([^"\']+)["\']`', $img, $match ) )
								$image['alt'] = str_replace( array( '-', '_' ), ' ', $match[1] );

							$image = apply_filters( 'wpseo_xml_sitemap_img', $image, $p );

							$url['images'][] = $image;
						}
					}
				}

				if ( strpos( $p->post_content, '[gallery' ) !== false ) {
					$attachments = get_children( array( 'post_parent' => $p->ID, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image' ) );
					foreach ( $attachments as $att_id => $attachment ) {
						$src   = wp_get_attachment_image_src( $att_id, 'large', false );
						$image = array(
							'src' => apply_filters( 'wpseo_xml_sitemap_img_src', $src[0], $p )
						);

						if ( $alt = get_post_meta( $att_id, '_wp_attachment_image_alt', true ) )
							$image['alt'] = $alt;

						$image['title'] = $attachment->post_title;

						$image = apply_filters( 'wpseo_xml_sitemap_img', $image, $p );

						$url['images'][] = $image;
					}
				}

				$url['images'] = apply_filters( 'wpseo_sitemap_urlimages', $url['images'], $p->ID );

				if ( ! in_array( $url['loc'], $stackedurls ) ) {
					// Use this filter to adjust the entry before it gets added to the sitemap
					$url = apply_filters( 'wpseo_sitemap_entry', $url, 'post', $p );
					if ( ! empty( $url ) ) {
						$output .= $this->sitemap_url( $url );
						$stackedurls[] = $url['loc'];
					}
				}

				// Clear the post_meta and the term cache for the post, as we no longer need it now.
				// wp_cache_delete( $p->ID, 'post_meta' );
				// clean_object_term_cache( $p->ID, $post_type );
			}
		}

		if ( empty( $output ) ) {
			$this->bad_sitemap = true;
			return;
		}

		$this->sitemap = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
		$this->sitemap .= 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" ';
		$this->sitemap .= 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
		$this->sitemap .= $output;

		// Filter to allow adding extra URLs, only do this on the first XML sitemap, not on all.
		if ( $n == 0 )
			$this->sitemap .= apply_filters( 'wpseo_sitemap_' . $post_type . '_content', '' );

		$this->sitemap .= '</urlset>';
	}

	/**
	 * Build a sub-sitemap for a specific taxonomy -- example.com/tax-sitemap.xml
	 *
	 * @param string $taxonomy Registered taxonomy's slug
	 */
	function build_tax_map( $taxonomy ) {
		if (
				( isset( $this->options['taxonomies-' . $taxonomy->name . '-not_in_sitemap'] ) && $this->options['taxonomies-' . $taxonomy->name . '-not_in_sitemap'] )
				|| in_array( $taxonomy, array( 'link_category', 'nav_menu', 'post_format' ) )
				|| apply_filters( 'wpseo_sitemap_exclude_taxonomy', false, $taxonomy->name )
		) {
			$this->bad_sitemap = true;
			return;
		}

		global $wpdb;
		$output = '';

		$steps  = $this->max_entries;
		$n      = (int) $this->n;
		$offset = ( $n > 1 ) ? ( $n - 1 ) * $this->max_entries : 0;
		$total  = $offset + $this->max_entries;

		$terms = get_terms( $taxonomy->name, array( 'hide_empty' => true ) );
		$terms = array_splice( $terms, $offset, $steps );

		foreach ( $terms as $c ) {
			$url = array();

			if ( wpseo_get_term_meta( $c, $c->taxonomy, 'noindex' )
					&& ! in_array( wpseo_get_term_meta( $c, $c->taxonomy, 'sitemap_include' ), array( 'always', '-' ) )
			)
				continue;

			if ( wpseo_get_term_meta( $c, $c->taxonomy, 'sitemap_include' ) == 'never' )
				continue;

			$url['loc'] = wpseo_get_term_meta( $c, $c->taxonomy, 'canonical' );
			if ( ! $url['loc'] ) {
				$url['loc'] = get_term_link( $c, $c->taxonomy );
				if ( isset( $this->options['trailingslash'] ) && $this->options['trailingslash'] )
					$url['loc'] = trailingslashit( $url['loc'] );
			}
			if ( $c->count > 10 ) {
				$url['pri'] = 0.6;
			}
			else if ( $c->count > 3 ) {
				$url['pri'] = 0.4;
			}
			else {
				$url['pri'] = 0.2;
			}

			// Grab last modified date
			$sql        = $wpdb->prepare( "SELECT MAX(p.post_modified_gmt) AS lastmod
					FROM	$wpdb->posts AS p
					INNER JOIN $wpdb->term_relationships AS term_rel
					ON		term_rel.object_id = p.ID
					INNER JOIN $wpdb->term_taxonomy AS term_tax
					ON		term_tax.term_taxonomy_id = term_rel.term_taxonomy_id
					AND		term_tax.taxonomy = %s
					AND		term_tax.term_id = %d
					WHERE	p.post_status IN ('publish','inherit')
					AND		p.post_password = ''", $c->taxonomy, $c->term_id );
			$url['mod'] = $wpdb->get_var( $sql );
			$url['chf'] = 'weekly';

			// Use this filter to adjust the entry before it gets added to the sitemap
			$url = apply_filters( 'wpseo_sitemap_entry', $url, 'term', $c );

			if ( ! empty( $url ) )
				$output .= $this->sitemap_url( $url );
		}

		if ( empty( $output ) ) {
			$this->bad_sitemap = true;
			return;
		}

		$this->sitemap = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
		$this->sitemap .= 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" ';
		$this->sitemap .= 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
		$this->sitemap .= $output . '</urlset>';
	}


	/**
	 * Build the sub-sitemap for authors
	 *
	 * @since 1.4.8
	 */
	function build_user_map() {
		if ( isset( $this->options['disable-author'] ) || isset( $this->options['disable_author_sitemap'] ) ) {			$this->bad_sitemap = true;
			return;
		}

		$output = '';

		$steps  = $this->max_entries;
		$n      = (int) $this->n;
		$offset = ( $n > 1 ) ? ( $n - 1 ) * $this->max_entries : 0;

		// initial query to fill in missing usermeta with the current timestamp
		$users = get_users( array(
			'who'        => 'authors',
			'meta_query' => array(
				array(
					'key'     => '_yoast_wpseo_profile_updated',
					'value'   => '', // This is ignored, but is necessary...
					'compare' => 'NOT EXISTS'
				)
			)
		) );

		foreach ( $users as $user ) {
			update_user_meta( $user->ID, '_yoast_wpseo_profile_updated', time() );
		}

		// query for users with this meta
		$users = get_users( array(
			'who'      => 'authors',
			'offset'   => $offset,
			'number'   => $steps,
			'meta_key' => '_yoast_wpseo_profile_updated',
			'orderby'  => 'meta_value_num',
			'order'    => 'ASC',
		) );

		$users = apply_filters( 'wpseo_sitemap_exclude_author', $users );

		// ascending sort
		usort( $users, array( $this, 'user_map_sorter' ) );

		foreach ( $users as $user ) {
			if ( $author_link = get_author_posts_url( $user->ID ) ) {
				$url = array(
					'loc' => $author_link,
					'pri' => 0.8,
					'chf' => 'weekly',
					'mod' => date( 'c', isset( $user->_yoast_wpseo_profile_updated ) ? $user->_yoast_wpseo_profile_updated : time() )
				);
				// Use this filter to adjust the entry before it gets added to the sitemap
				$url = apply_filters( 'wpseo_sitemap_entry', $url, 'user', $user );

				if ( ! empty( $url ) )
					$output .= $this->sitemap_url( $url );
			}
		}

		if ( empty( $output ) ) {
			$this->bad_sitemap = true;
			return;
		}

		$this->sitemap = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" ';
		$this->sitemap .= 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" ';
		$this->sitemap .= 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
		$this->sitemap .= $output;

		// Filter to allow adding extra URLs, only do this on the first XML sitemap, not on all.
		if ( $n == 0 )
			$this->sitemap .= apply_filters( 'wpseo_sitemap_author_content', '' );

		$this->sitemap .= '</urlset>';
	}

	/**
	 * Spits out the XSL for the XML sitemap.
	 *
	 * @param string $type
	 *
	 * @since 1.4.13
	 */
	function xsl_output( $type ) {
		if ( $type == 'main' ) {
			header( 'HTTP/1.1 200 OK', true, 200 );
			// Prevent the search engines from indexing the XML Sitemap.
			header( 'X-Robots-Tag: noindex, follow', true );
			header( 'Content-Type: text/xml' );

			// Make the browser cache this file properly.
			$expires = 60 * 60 * 24 * 365;
			header( 'Pragma: public' );
			header( 'Cache-Control: maxage=' . $expires );
			header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', time() + $expires ) . ' GMT' );

			require_once( WPSEO_PATH . 'css/xml-sitemap-xsl.php' );
		}
		else {
			do_action( 'wpseo_xsl_' . $type );
		}
	}

	/**
	 * Spit out the generated sitemap and relevant headers and encoding information.
	 */
	function output() {
		header( 'HTTP/1.1 200 OK', true, 200 );
		// Prevent the search engines from indexing the XML Sitemap.
		header( 'X-Robots-Tag: noindex, follow', true );
		header( 'Content-Type: text/xml' );
		echo '<?xml version="1.0" encoding="' . get_bloginfo( 'charset' ) . '"?>';
		if ( $this->stylesheet )
			echo apply_filters( 'wpseo_stylesheet_url', $this->stylesheet ) . "\n";
		echo $this->sitemap;
		echo "\n" . '<!-- XML Sitemap generated by Yoast WordPress SEO -->';

		if ( WP_DEBUG )
			echo "\n" . '<!-- ' . memory_get_peak_usage() . ' | ' . count( $GLOBALS['wpdb']->queries ) . ' -->';
	}

	/**
	 * Build the <url> tag for a given URL.
	 *
	 * @param array $url Array of parts that make up this entry
	 *
	 * @return string
	 */
	function sitemap_url( $url ) {
		if ( isset( $url['mod'] ) )
			$date = mysql2date( "Y-m-d\TH:i:s+00:00", $url['mod'] );
		else
			$date = date( 'c' );
		$url['loc'] = htmlspecialchars( $url['loc'] );
		$output     = "\t<url>\n";
		$output .= "\t\t<loc>" . $url['loc'] . "</loc>\n";
		$output .= "\t\t<lastmod>" . $date . "</lastmod>\n";
		$output .= "\t\t<changefreq>" . $url['chf'] . "</changefreq>\n";
		$output .= "\t\t<priority>" . str_replace( ',', '.', $url['pri'] ) . "</priority>\n";
		if ( isset( $url['images'] ) && count( $url['images'] ) > 0 ) {
			foreach ( $url['images'] as $img ) {
				if ( ! isset( $img['src'] ) || empty( $img['src'] ) )
					continue;
				$output .= "\t\t<image:image>\n";
				$output .= "\t\t\t<image:loc>" . esc_html( $img['src'] ) . "</image:loc>\n";
				if ( isset( $img['title'] ) && ! empty( $img['title'] ) )
					$output .= "\t\t\t<image:title>" . _wp_specialchars( html_entity_decode( $img['title'], ENT_QUOTES, get_bloginfo( 'charset' ) ) ) . "</image:title>\n";
				if ( isset( $img['alt'] ) && ! empty( $img['alt'] ) )
					$output .= "\t\t\t<image:caption>" . _wp_specialchars( html_entity_decode( $img['alt'], ENT_QUOTES, get_bloginfo( 'charset' ) ) ) . "</image:caption>\n";
				$output .= "\t\t</image:image>\n";
			}
		}
		$output .= "\t</url>\n";
		return $output;
	}

	/**
	 * Make a request for the sitemap index so as to cache it before the arrival of the search engines.
	 */
	function hit_sitemap_index() {
		$base = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '';
		$url  = home_url( $base . 'sitemap_index.xml' );
		wp_remote_get( $url );
	}

	/**
	 * Hook into redirect_canonical to stop trailing slashes on sitemap.xml URLs
	 *
	 * @param string $redirect The redirect URL currently determined.
	 *
	 * @return bool|string $redirect
	 */
	function canonical( $redirect ) {
		$sitemap = get_query_var( 'sitemap' );
		if ( ! empty( $sitemap ) )
			return false;

		$xsl = get_query_var( 'xsl' );
		if ( ! empty( $xsl ) )
			return false;

		return $redirect;
	}

	/**
	 * Get the modification date for the last modified post in the post type:
	 *
	 * @param array $post_types Post types to get the last modification date for
	 *
	 * @return string
	 */
	function get_last_modified( $post_types ) {
		global $wpdb;
		if ( ! is_array( $post_types ) )
			$post_types = array( $post_types );

		$result = 0;
		foreach ( $post_types as $post_type ) {
			$key  = 'lastpostmodified:gmt:' . $post_type;
			$date = wp_cache_get( $key, 'timeinfo' );
			if ( ! $date ) {
				$date = $wpdb->get_var( $wpdb->prepare( "SELECT post_modified_gmt FROM $wpdb->posts WHERE post_status IN ('publish','inherit') AND post_type = %s ORDER BY post_modified_gmt DESC LIMIT 1", $post_type ) );
				if ( $date )
					wp_cache_set( $key, $date, 'timeinfo' );
			}
			if ( strtotime( $date ) > $result )
				$result = strtotime( $date );
		}

		// Transform to W3C Date format.
		$result = date( 'c', $result );
		return $result;
	}

	/**
	 * Parse the requested sitemap's identifier to check for a user sitemap pattern
	 *
	 * since 1.6
	 *
	 * @param string $type The requested sitemap's identifier.
	 *
	 * @return string $user a WP_User object or false
	 */
	private function is_user_sitemap( $type ) {
		$pieces = explode( '-', $type, 2 );
		$user   = isset( $pieces[1] ) ? $pieces[1] : '';
		return get_user_by( 'slug', $user );
	}


	/**
	 * Sorts an array of WP_User by the _yoast_wpseo_profile_updated meta field
	 *
	 * since 1.6
	 *
	 * @param Wp_User $a The first WP user
	 * @param Wp_User $b The second WP user
	 *
	 * @return int 0 if equal, 1 if $a is larger else or -1;
	 */
	private
	function user_map_sorter( $a, $b ) {
		if ( ! isset( $a->_yoast_wpseo_profile_updated ) ) {
			$a->_yoast_wpseo_profile_updated = time();
		}
		if ( ! isset( $b->_yoast_wpseo_profile_updated ) ) {
			$b->_yoast_wpseo_profile_updated = time();
		}
		
		if ( $a->_yoast_wpseo_profile_updated == $b->_yoast_wpseo_profile_updated ) {
			return 0;
		}
		return ( $a->_yoast_wpseo_profile_updated > $b->_yoast_wpseo_profile_updated ) ? 1 : - 1;
	}

}

global $wpseo_sitemaps;
$wpseo_sitemaps = new WPSEO_Sitemaps();
