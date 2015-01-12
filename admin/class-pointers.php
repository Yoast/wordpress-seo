<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}


if ( ! class_exists( 'WPSEO_Pointers' ) ) {
	/**
	 * This class handles the pointers used in the introduction tour.
	 *
	 * @todo Add an introductory pointer on the edit post page too.
	 */
	class WPSEO_Pointers {

		/**
		 * @var    object    Instance of this class
		 */
		public static $instance;

		/**
		 * Class constructor.
		 */
		private function __construct() {
			if ( current_user_can( 'manage_options' ) ) {
				$options = get_option( 'wpseo' );
				if ( $options['tracking_popup_done'] === false || $options['ignore_tour'] === false ) {
					wp_enqueue_style( 'wp-pointer' );
					wp_enqueue_script( 'jquery-ui' );
					wp_enqueue_script( 'wp-pointer' );
					wp_enqueue_script( 'utils' );
				}
				if ( $options['tracking_popup_done'] === false && ! isset( $_GET['allow_tracking'] ) ) {
					add_action( 'admin_print_footer_scripts', array( $this, 'tracking_request' ) );
				} elseif ( $options['ignore_tour'] === false ) {
					add_action( 'admin_print_footer_scripts', array( $this, 'intro_tour' ) );
				}
			}
		}

		/**
		 * Get the singleton instance of this class
		 *
		 * @return object
		 */
		public static function get_instance() {
			if ( ! ( self::$instance instanceof self ) ) {
				self::$instance = new self();
			}

			return self::$instance;
		}


		/**
		 * Shows a popup that asks for permission to allow tracking.
		 */
		function tracking_request() {
			$id    = '#wpadminbar';
			$nonce = wp_create_nonce( 'wpseo_activate_tracking' );

			$content = '<h3>' . __( 'Help improve WordPress SEO', 'wordpress-seo' ) . '</h3>';
			$content .= '<p>' . __( 'You&#8217;ve just installed WordPress SEO by Yoast. Please helps us improve it by allowing us to gather anonymous usage stats so we know which configurations, plugins and themes to test with.', 'wordpress-seo' ) . '</p>';
			$opt_arr      = array(
				'content'  => $content,
				'position' => array( 'edge' => 'top', 'align' => 'center' )
			);
			$button_array = array(
				'button1' => array(
					'text'     => __( 'Do not allow tracking', 'wordpress-seo' ),
					'function' => 'wpseo_store_answer("no","' . $nonce . '")',
				),
				'button2' => array(
					'text'     => __( 'Allow tracking', 'wordpress-seo' ),
					'function' => 'wpseo_store_answer("yes","' . $nonce . '")',
				),
			);

			$this->print_scripts( $id, $opt_arr, $button_array );
		}

		/**
		 * Load the introduction tour
		 */
		function intro_tour() {
			global $pagenow, $current_user;

			// @FIXME: Links to tabs only work with target="_blank" and thus open in a new window
			$adminpages = array(
				'wpseo_dashboard'      => array(
					'content'       => '<h3>' . __( 'Dashboard', 'wordpress-seo' ) . '</h3><p>' . __( 'This is the WordPress SEO Dashboard, here you can restart this tour or revert the WP SEO settings to default.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'More WordPress SEO', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'There&#8217;s more to learn about WordPress &amp; SEO than just using this plugin. A great start is our article %1$sthe definitive guide to WordPress SEO%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/articles/wordpress-seo/#utm_source=wpseo_dashboard&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>'
						. '<p><strong>' . __( 'Tracking', 'wordpress-seo' ) . '</strong><br/>' . __( 'To provide you with the best experience possible, we need your help. Please enable tracking to help us gather anonymous usage data.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Webmaster Tools', 'wordpress-seo' ) . '</strong><br/>' . __( 'You can also add the verification codes for the different Webmaster Tools programs here, we highly encourage you to check out both Google and Bing&#8217;s Webmaster Tools.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'WordPress SEO Tour', 'wordpress-seo' ) . '</strong><br/>' . __( 'This tour will show you around in the plugin, to give you a general overview of the plugin.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Newsletter', 'wordpress-seo' ) . '</strong><br/>' .
						__( 'If you would like us to keep you up-to-date regarding WordPress SEO and other plugins by Yoast, subscribe to our newsletter:', 'wordpress-seo' ) . '</p>' .
						'<form action="http://yoast.us1.list-manage1.com/subscribe/post?u=ffa93edfe21752c921f860358&amp;id=972f1c9122" method="post" id="newsletter-form" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">' .
						'<p>' .
						'<label for="newsletter-email">' . __( 'Email', 'wordpress-seo' ) . ':</label> <input style="margin: 5px; color:#666" name="EMAIL" value="' . esc_attr( $current_user->user_email ) . '" id="newsletter-email" placeholder="' . __( 'Email', 'wordpress-seo' ) . '"/><br/>' .
						'<input type="hidden" name="group" value="2"/>' .
						'<button type="submit" class="button-primary">' . __( 'Subscribe', 'wordpress-seo' ) . '</button>' .
						'</p></form>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_titles' ) . '";',
					'position'      => array( 'edge' => 'top', 'align' => 'center' ),
				),
				'wpseo_titles'         => array(
					'content'       => '<h3>' . __( 'Title &amp; Metas settings', 'wordpress-seo' ) . '</h3>' . '<p>' . __( 'This is where you set the titles and meta-information for all your post types, taxonomies, archives, special pages and for your homepage. The page is divided into different tabs. Make sure you check &#8217;em all out!', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Sitewide settings', 'wordpress-seo' ) . '</strong><br/>' . __( 'The first tab will show you site-wide settings. You can also set some settings for the entire site here to add specific meta tags or to remove some unneeded cruft.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Templates and settings', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'Now click on the &#8216;%1$sPost Types%2$s&#8217;-tab, as this will be our example.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( admin_url( 'admin.php?page=wpseo_titles#top#post_types' ) ) . '">', '</a>' ) . '<br />' . __( 'The templates are built using variables. You can find all these variables in the help tab (in the top-right corner of the page). The settings allow you to set specific behavior for the post types.', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_social' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_dashboard' ) . '";',
				),
				'wpseo_social'         => array(
					'content'       => '<h3>' . __( 'Social settings', 'wordpress-seo' ) . '</h3>'
						. '<p><strong>' . __( 'Facebook', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'On this tab you can enable the %1$sFacebook Open Graph%2$s functionality from this plugin, as well as assign a Facebook user or Application to be the admin of your site, so you can view the Facebook insights.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/facebook-open-graph-protocol/#utm_source=wpseo_social&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p><p>' . __( 'The frontpage settings allow you to set meta-data for your homepage, whereas the default settings allow you to set a fallback for all posts/pages without images. ', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Twitter', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'With %1$sTwitter Cards%2$s, you can attach rich photos, videos and media experience to tweets that drive traffic to your website. Simply check the box, sign up for the service, and users who Tweet links to your content will have a &#8220;Card&#8221; added to the tweet that&#8217;s visible to all of their followers.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/twitter-cards/#utm_source=wpseo_social&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>'
						. '<p><strong>' . __( 'Google+', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'This tab allows you to add specific post meta data for Google+. And if you have a Google+ page for your business, add that URL here and link it on your %1$sGoogle+%2$s page&#8217;s about page.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://plus.google.com/' ) . '">', '</a>' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_xml' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_titles' ) . '";',
				),
				'wpseo_xml'            => array(
					'content'       => '<h3>' . __( 'XML Sitemaps', 'wordpress-seo' ) . '</h3>'
						. '<p><strong>' . __( 'What are XML sitemaps?', 'wordpress-seo' ) . '</strong><br/>' . __( 'A Sitemap is an XML file that lists the URLs for a site. It allows webmasters to include additional information about each URL: when it was last updated, how often it changes, and how important it is in relation to other URLs in the site. This allows search engines to crawl the site more intelligently.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'What does the plugin do with XML Sitemaps?', 'wordpress-seo' ) . '</strong><br/>' . __( 'This plugin adds XML sitemaps to your site. The sitemaps are automatically updated when you publish a new post, page or custom post and Google and Bing will be automatically notified. You can also have the plugin automatically notify Yahoo! and Ask.com.', 'wordpress-seo' ) . '</p><p>' . __( 'If you want to exclude certain post types and/or taxonomies, you can also set that on this page.', 'wordpress-seo' ) . '</p><p>' . __( 'Is your webserver low on memory? Decrease the entries per sitemap (default: 1000) to reduce load.', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_permalinks' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_social' ) . '";',
				),
				'wpseo_permalinks'     => array(
					'content'       => '<h3>' . __( 'Permalink Settings', 'wordpress-seo' ) . '</h3><p>' . __( 'All of the options here are for advanced users only, if you don&#8217;t know whether you should check any, don&#8217;t touch them.', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_internal-links' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_xml' ) . '";',
				),
				'wpseo_internal-links' => array(
					'content'       => '<h3>' . __( 'Breadcrumbs Settings', 'wordpress-seo' ) . '</h3><p>' . sprintf( __( 'If your theme supports my breadcrumbs, as all Genesis and WooThemes themes as well as a couple of other ones do, you can change the settings for those here. If you want to modify your theme to support them, %sfollow these instructions%s.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/wordpress/plugins/breadcrumbs/#utm_source=wpseo_permalinks&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_rss' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_permalinks' ) . '";',
				),
				'wpseo_rss'            => array(
					'content'       => '<h3>' . __( 'RSS Settings', 'wordpress-seo' ) . '</h3><p>' . __( 'This incredibly powerful function allows you to add content to the beginning and end of your posts in your RSS feed. This helps you gain links from people who steal your content!', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_import' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_internal-links' ) . '";',
				),
				'wpseo_import'         => array(
					'content'       => '<h3>' . esc_html__( 'Import & Export', 'wordpress-seo' ) . '</h3>'
						. '<p><strong>' . __( 'Import from other (SEO) plugins', 'wordpress-seo' ) . '</strong><br/>' . __( 'We can imagine that you switch from another SEO plugin to WordPress SEO. If you just did, you can use these options to transfer your SEO-data. If you were using one of my older plugins like Robots Meta &amp; RSS Footer, you can import the settings here too.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Other imports', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'If you&#8217;re using one of our premium plugins, such as %1$sLocal SEO%2$s, you can also find specific import-options for that plugin here.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/wordpress/plugins/local-seo/#utm_source=wpseo_import&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>'
						. '<p><strong>' . __( 'Export', 'wordpress-seo' ) . '</strong><br/>' . __( 'If you have multiple blogs and you&#8217;re happy with how you&#8217;ve configured this blog, you can export the settings and import them on another blog so you don&#8217;t have to go through this process twice!', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . network_admin_url( 'admin.php?page=wpseo_bulk-editor' ) . '";', // will auto-use admin_url if not on multi-site
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_rss' ) . '";',
				),
				'wpseo_bulk-editor'    => array(
					'content'       => '<h3>' . __( 'Bulk Editor', 'wordpress-seo' ) . '</h3><p>' . __( 'This page lets you view and edit the titles and meta descriptions of all posts and pages on your site. This allows you to edit the title or meta description of all your pages in one place, rather than having to edit each individual page.', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_files' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_import' ) . '";',
				),
				'wpseo_files'          => array(
					'content'       => '<h3>' . __( 'File Editor', 'wordpress-seo' ) . '</h3><p>' . __( 'Here you can edit the .htaccess and robots.txt files, two of the most powerful files in your WordPress install, if your WordPress installation has write-access to the files. But please, only touch these files if you know what you&#8217;re doing!', 'wordpress-seo' ) . '</p>',
					'next'          => __( 'Next', 'wordpress-seo' ),
					'next_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_licenses' ) . '";',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_bulk-editor' ) . '";',
				),
				'wpseo_licenses'       => array(
					'content'       => '<h3>' . __( 'Extensions and Licenses', 'wordpress-seo' ) . '</h3>'
						. '<p><strong>' . __( 'Extensions', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'The powerful functions of WordPress SEO can be extended with %1$sYoast premium plugins%2$s. These premium plugins require the installation of WordPress SEO or WordPress SEO Premium and add specific functionality. You can read all about the Yoast Premium Plugins on %1$shttp://yoast.com/wordpress/plugins/%2$s.', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/wordpress/plugins/#utm_source=wpseo_licenses&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>'
						. '<p><strong>' . __( 'Licenses', 'wordpress-seo' ) . '</strong><br/>' . __( 'Once you&#8217;ve purchased WordPress SEO Premium or any other premium Yoast plugin, you&#8217;ll have to enter a license key. You can do so on the Licenses-tab. Once you&#8217;ve activated your premium plugin, you can use all its powerful features.', 'wordpress-seo' ) . '</p>'
						. '<p><strong>' . __( 'Like this plugin?', 'wordpress-seo' ) . '</strong><br/>' . sprintf( __( 'So, we&#8217;ve come to the end of the tour. If you like the plugin, please %srate it 5 stars on WordPress.org%s!', 'wordpress-seo' ), '<a target="_blank" href="https://wordpress.org/plugins/wordpress-seo/">', '</a>' ) . '</p>'
						. '<p>' . sprintf( __( 'Thank you for using my plugin and good luck with your SEO!<br/><br/>Best,<br/>Team Yoast - %1$sYoast.com%2$s', 'wordpress-seo' ), '<a target="_blank" href="' . esc_url( 'https://yoast.com/#utm_source=wpseo_licenses&utm_medium=wpseo_tour&utm_campaign=tour' ) . '">', '</a>' ) . '</p>',
					'prev'          => __( 'Previous', 'wordpress-seo' ),
					'prev_function' => 'window.location="' . admin_url( 'admin.php?page=wpseo_files' ) . '";',
				),
			);

			// Skip tour about wpseo_files page if file editing is disallowed or if the site is a multisite and the current user isn't a superadmin
			if ( false === wpseo_allow_system_file_edit() ) {
				unset( $adminpages['wpseo_files'] );
				$adminpages['wpseo_bulk-editor']['function'] = 'window.location="' . admin_url( 'admin.php?page=wpseo_licenses' ) . '";';
			}

			$page = '';
			if ( isset( $_GET['page'] ) ) {
				$page = $_GET['page'];
			}

			$button_array = array(
				'button1' => array(
					'text'     => __( 'Close', 'wordpress-seo' ),
					'function' => '',
				)
			);
			$opt_arr      = array();
			$id           = '#wpseo-title';
			if ( 'admin.php' != $pagenow || ! array_key_exists( $page, $adminpages ) ) {
				$id      = 'li.toplevel_page_wpseo_dashboard';
				$content = '<h3>' . __( 'Congratulations!', 'wordpress-seo' ) . '</h3>';
				$content .= '<p>' . __( 'You&#8217;ve just installed WordPress SEO by Yoast! Click &#8220;Start Tour&#8221; to view a quick introduction of this plugin&#8217;s core functionality.', 'wordpress-seo' ) . '</p>';
				$opt_arr                             = array(
					'content'  => $content,
					'position' => array( 'edge' => 'bottom', 'align' => 'center' )
				);
				$button_array['button2']['text']     = __( 'Start Tour', 'wordpress-seo' );
				$button_array['button2']['function'] = 'document.location="' . admin_url( 'admin.php?page=wpseo_dashboard' ) . '";';
			} else {
				if ( '' != $page && in_array( $page, array_keys( $adminpages ) ) ) {
					$align   = ( is_rtl() ) ? 'left' : 'right';
					$opt_arr = array(
						'content'      => $adminpages[$page]['content'],
						'position'     => ( isset ( $adminpages[$page]['position'] ) ) ? ( $adminpages[$page]['position'] ) : array( 'edge' => 'top', 'align' => $align ),
						'pointerWidth' => 450,
					);
					if ( isset( $adminpages[$page]['next'] ) && isset( $adminpages[$page]['next_function'] ) ) {
						$button_array['button2'] = array(
							'text'     => $adminpages[$page]['next'],
							'function' => $adminpages[$page]['next_function'],
						);
					}
					if ( isset( $adminpages[$page]['prev'] ) && isset( $adminpages[$page]['prev_function'] ) ) {
						$button_array['button3'] = array(
							'text'     => $adminpages[$page]['prev'],
							'function' => $adminpages[$page]['prev_function'],
						);
					}
				}
			}

			$this->print_scripts( $id, $opt_arr, $button_array );
		}


		/**
		 * Prints the pointer script
		 *
		 * @param string $selector     The CSS selector the pointer is attached to.
		 * @param array  $options      The options for the pointer.
		 * @param array  $button_array The options for the buttons.
		 */
		function print_scripts( $selector, $options, $button_array ) {
			$button_array_defaults = array(
				'button1' => array(
					'text'     => false,
					'function' => '',
				),
				'button2' => array(
					'text'     => false,
					'function' => '',
				),
				'button3' => array(
					'text'     => false,
					'function' => '',
				),
			);
			$button_array          = wp_parse_args( $button_array, $button_array_defaults );
			?>
			<script type="text/javascript">
				//<![CDATA[
				(function ($) {
					// Don't show the tour on screens with an effective width smaller than 1024px or an effective height smaller than 768px.
					if (jQuery(window).width() < 1024 || jQuery(window).availWidth < 1024 ) {
						return;
					}

					var wpseo_pointer_options = <?php echo json_encode( $options ); ?>, setup;

					function wpseo_store_answer(input, nonce) {
						var wpseo_tracking_data = {
							action        : 'wpseo_allow_tracking',
							allow_tracking: input,
							nonce         : nonce
						};
						jQuery.post(ajaxurl, wpseo_tracking_data, function () {
							jQuery('#wp-pointer-0').remove();
						});
					}

					wpseo_pointer_options = $.extend(wpseo_pointer_options, {
						buttons: function (event, t) {
							var button = jQuery('<a id="pointer-close" style="margin:0 5px;" class="button-secondary">' + '<?php echo $button_array['button1']['text']; ?>' + '</a>');
							button.bind('click.pointer', function () {
								t.element.pointer('close');
							});
							return button;
						},
						close  : function () {
						}
					});

					setup = function () {
						$('<?php echo $selector; ?>').pointer(wpseo_pointer_options).pointer('open');
						<?php if ( $button_array['button2']['text'] ) { ?>
						jQuery('#pointer-close').after('<a id="pointer-primary" class="button-primary">' + '<?php echo $button_array['button2']['text']; ?>' + '</a>');
						jQuery('#pointer-primary').click(function () {
							<?php echo $button_array['button2']['function']; ?>
						});
						<?php if ( $button_array['button3']['text'] ) { ?>
						jQuery('#pointer-primary').after('<a id="pointer-ternary" style="float: left;" class="button-secondary">' + '<?php echo $button_array['button3']['text']; ?>' + '</a>');
						jQuery('#pointer-ternary').click(function () {
							<?php echo $button_array['button3']['function']; ?>
						});
						<?php } ?>
						jQuery('#pointer-close').click(function () {
							<?php if ( $button_array['button1']['function'] == '' ) { ?>
							wpseo_setIgnore("tour", "wp-pointer-0", "<?php echo esc_js( wp_create_nonce( 'wpseo-ignore' ) ); ?>");
							<?php } else { ?>
							<?php echo $button_array['button1']['function']; ?>
							<?php } ?>
						});
						<?php } else if ( $button_array['button3']['text'] ) { ?>
						jQuery('#pointer-close').after('<a id="pointer-ternary" style="float: left;" class="button-secondary">' + '<?php echo $button_array['button3']['text']; ?>' + '</a>');
						jQuery('#pointer-ternary').click(function () {
							<?php echo $button_array['button3']['function']; ?>
						});
						<?php } ?>
					};

					if (wpseo_pointer_options.position && wpseo_pointer_options.position.defer_loading)
						$(window).bind('load.wp-pointers', setup);
					else
						$(document).ready(setup);
				})(jQuery);
				//]]>
			</script>
		<?php
		}


		/**
		 * Load a tiny bit of CSS in the head
		 *
		 * @deprecated 1.5.0, now handled by css
		 */
		function admin_head() {
			_deprecated_function( __METHOD__, 'WPSEO 1.5.0' );

			return;
		}

	} /* End of class */

} /* End of class-exists wrapper */
