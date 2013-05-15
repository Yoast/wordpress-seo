<?php
/**
 * @package Admin
 *
 * This code generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * class WPSEO_Metabox
 *
 * The class that generates the metabox on the edit post / page as well as contains all page analysis functionality.
 */
class WPSEO_Metabox {

	/**
	 * @var int $meta_length Allowed length of the meta description.
	 */
	var $meta_length = 156;

	/**
	 * @var string $meta_length_reason Reason the meta description is not the default length.
	 */
	var $meta_length_reason = '';

	/**
	 * Class constructor
	 */
	function __construct() {
		if ( !class_exists( 'Yoast_TextStatistics' ) && apply_filters( 'wpseo_use_page_analysis', true ) === true )
			require_once( WPSEO_PATH . "/admin/TextStatistics.php" );

		add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
		add_action( 'admin_print_styles-post-new.php', array( $this, 'enqueue' ) );
		add_action( 'admin_print_styles-post.php', array( $this, 'enqueue' ) );
		add_action( 'admin_print_styles-edit.php', array( $this, 'enqueue' ) );
		add_action( 'admin_head', array( $this, 'script' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_custom_box' ) );
		add_action( 'wp_insert_post', array( $this, 'save_postdata' ) );
		add_action( 'edit_attachment', array( $this, 'save_postdata' ) );
		add_action( 'add_attachment', array( $this, 'save_postdata' ) );
		add_action( 'admin_init', array( $this, 'setup_page_analysis' ) );
	}

	/**
	 * Sets up all the functionality related to the prominence of the page analysis functionality.
	 */
	public function setup_page_analysis() {

		if ( apply_filters( 'wpseo_use_page_analysis', true ) === true ) {

			$options = get_wpseo_options();

			foreach ( get_post_types( array( 'public' => true ), 'names' ) as $pt ) {
				if ( isset( $options['hideeditbox-' . $pt] ) && $options['hideeditbox-' . $pt] )
					continue;
				add_filter( 'manage_' . $pt . '_posts_columns', array( $this, 'column_heading' ), 10, 1 );
				add_action( 'manage_' . $pt . '_posts_custom_column', array( $this, 'column_content' ), 10, 2 );
				add_action( 'manage_edit-' . $pt . '_sortable_columns', array( $this, 'column_sort' ), 10, 2 );
			}
			add_filter( 'request', array( $this, 'column_sort_orderby' ) );

			add_action( 'restrict_manage_posts', array( $this, 'posts_filter_dropdown' ) );
			add_action( 'post_submitbox_misc_actions', array( $this, 'publish_box' ) );
		}

	}

	/**
	 * Lowercase a sentence while preserving "weird" characters.
	 *
	 * This should work with Greek, Russian, Polish & French amongst other languages...
	 *
	 * @param string $string String to lowercase
	 * @return string
	 */
	public function strtolower_utf8( $string ) {
		$convert_to   = array(
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u",
			"v", "w", "x", "y", "z", "à", "á", "â", "ã", "ä", "å", "æ", "ç", "è", "é", "ê", "ë", "ì", "í", "î", "ï",
			"ð", "ñ", "ò", "ó", "ô", "õ", "ö", "ø", "ù", "ú", "û", "ü", "ý", "а", "б", "в", "г", "д", "е", "ё", "ж",
			"з", "и", "й", "к", "л", "м", "н", "о", "п", "р", "с", "т", "у", "ф", "х", "ц", "ч", "ш", "щ", "ъ", "ы",
			"ь", "э", "ю", "я", "ą", "ć", "ę", "ł", "ń", "ó", "ś", "ź", "ż"
		);
		$convert_from = array(
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U",
			"V", "W", "X", "Y", "Z", "À", "Á", "Â", "Ã", "Ä", "Å", "Æ", "Ç", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï",
			"Ð", "Ñ", "Ò", "Ó", "Ô", "Õ", "Ö", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж",
			"З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ъ",
			"Ь", "Э", "Ю", "Я", "Ą", "Ć", "Ę", "Ł", "Ń", "Ó", "Ś", "Ź", "Ż"
		);

		return str_replace( $convert_from, $convert_to, $string );
	}

	/**
	 * Outputs the page analysis score in the Publish Box.
	 */
	public function publish_box() {
		echo '<div class="misc-pub-section misc-yoast misc-pub-section-last">';

		if ( wpseo_get_value( 'meta-robots-noindex' ) == 1 ) {
			$score = 'noindex';
			$title = __( 'Post is set to noindex.', 'wordpress-seo' );
		} else {
			$score = wpseo_get_value( 'linkdex' );
			if ( $score ) {
				$score = round( $score / 10 );
				if ( $score < 1 )
					$score = 1;
				$score = wpseo_translate_score( $score );
			} else {
				if ( isset( $_GET['post'] ) ) {
					$post_id = (int) $_GET['post'];
					$post    = get_post( $post_id );
				} else {
					global $post;
				}

				$this->calculate_results( $post );
				$score = wpseo_get_value( 'linkdex' );
				if ( !$score || empty( $score ) ) {
					$score = 'na';
					$title = __( 'No focus keyword set.', 'wordpress-seo' );
				}
			}
		}
		if ( !isset( $title ) )
			$title = ucfirst( $score );
		$result = '<div title="' . esc_attr( $title ) . '" alt="' . esc_attr( $title ) . '" class="wpseo_score_img ' . $score . '"></div>';

		echo 'SEO: ' . $result . ' <a class="wpseo_tablink scroll" href="#wpseo_linkdex">Check</a>';

		echo '</div>';
	}

	/**
	 * Adds the WordPress SEO box to the edit boxes in the edit post / page overview.
	 */
	public function add_custom_box() {
		$options = get_wpseo_options();

		foreach ( get_post_types( array( 'public' => true ) ) as $posttype ) {
			if ( isset( $options['hideeditbox-' . $posttype] ) && $options['hideeditbox-' . $posttype] )
				continue;
			add_meta_box( 'wpseo_meta', __( 'WordPress SEO by Yoast', 'wordpress-seo' ), array( $this, 'meta_box' ), $posttype, 'normal', apply_filters( 'wpseo_metabox_prio', 'high' ) );
		}
	}

	/**
	 * Outputs the scripts needed for the edit / post page overview, snippet preview, etc.
	 *
	 * @return bool
	 */
	public function script() {
		if ( isset( $_GET['post'] ) ) {
			$post_id = (int) $_GET['post'];
			$post    = get_post( $post_id );
		} else {
			global $post;
		}

		if ( !isset( $post ) )
			return false;

		$options = get_wpseo_options();

		$date = '';
		if ( isset( $options['showdate-' . $post->post_type] ) && $options['showdate-' . $post->post_type] ) {
			$date = $this->get_post_date( $post );

			$this->meta_length        = $this->meta_length - ( strlen( $date ) + 5 );
			$this->meta_length_reason = __( ' (because of date display)', 'wordpress-seo' );
		}

		$this->meta_length_reason = apply_filters( 'wpseo_metadesc_length_reason', $this->meta_length_reason, $post );
		$this->meta_length        = apply_filters( 'wpseo_metadesc_length', $this->meta_length, $post );

		unset( $date );

		$title_template = '';
		if ( isset( $options['title-' . $post->post_type] ) )
			$title_template = $options['title-' . $post->post_type];

		// If there's no title template set, use the default, otherwise title preview won't work.
		if ( $title_template == '' )
			$title_template = '%%title%% - %%sitename%%';
		$title_template = wpseo_replace_vars( $title_template, $post, array( '%%title%%' ) );

		$metadesc_template = '';
		if ( isset( $options['metadesc-' . $post->post_type] ) )
			$metadesc_template = wpseo_replace_vars( $options['metadesc-' . $post->post_type], $post, array( '%%excerpt%%', '%%excerpt_only%%' ) );

		$sample_permalink = get_sample_permalink( $post->ID );
		$sample_permalink = str_replace( '%page', '%post', $sample_permalink[0] );
		?>
		<script type="text/javascript">
			var wpseo_lang = '<?php echo substr( get_locale(), 0, 2 ); ?>';
			var wpseo_meta_desc_length = '<?php echo $this->meta_length; ?>';
			var wpseo_title_template = '<?php echo esc_attr( $title_template ); ?>';
			var wpseo_metadesc_template = '<?php echo esc_attr( $metadesc_template ); ?>';
			var wpseo_permalink_template = '<?php echo esc_url( $sample_permalink ); ?>';
			var wpseo_keyword_suggest_nonce = '<?php echo wp_create_nonce( 'wpseo-get-suggest' ); ?>';
		</script>
	<?php
	}

	/**
	 * Add the meta box
	 */
	public function add_meta_box() {
		$options = get_wpseo_options();

		foreach ( get_post_types( array( 'public' => true ) ) as $posttype ) {
			if ( isset( $options['hideeditbox-' . $posttype] ) && $options['hideeditbox-' . $posttype] )
				continue;
			add_meta_box( 'wpseo_meta', __( 'WordPress SEO by Yoast', 'wordpress-seo' ), array( $this, 'meta_box' ), $posttype, 'normal', apply_filters( 'wpseo_metabox_prio', 'high' ) );
		}
	}

	/**
	 * Output a tab in the WP SEO Metabox
	 *
	 * @param string $id      CSS ID of the tab.
	 * @param string $heading Heading for the tab.
	 * @param string $content Content of the tab. This content should be escaped.
	 */
	public function do_tab( $id, $heading, $content ) {
		?>
		<div class="wpseotab <?php echo esc_attr( $id ) ?>">
			<h4 class="wpseo-heading"><?php echo esc_html( $heading ); ?></h4>
			<table class="form-table">
				<?php echo $content ?>
			</table>
		</div>
	<?php
	}

	/**
	 * Retrieve the meta boxes for the given post type.
	 *
	 * @param string $post_type
	 * @return array
	 */
	public function get_meta_boxes( $post_type = 'post' ) {
		$options = get_wpseo_options();

		$mbs                   = array();
		$mbs['snippetpreview'] = array(
			"name"  => "snippetpreview",
			"type"  => "snippetpreview",
			"title" => __( "Snippet Preview", 'wordpress-seo' ),
		);
		$mbs['focuskw']        = array(
			"name"         => "focuskw",
			"std"          => "",
			"type"         => "text",
			"title"        => __( 'Focus Keyword', 'wordpress-seo' ),
			"autocomplete" => "off",
			"help"         => sprintf( "Pick the main keyword or keyphrase that this post/page is about.<br/><br/>Read %sthis post%s for more info.", "<a href='http://yoast.com/focus-keyword/#utm_source=wordpress-seo-metabox&utm_medium=inline-help&utm_campaign=focus-keyword'>", '</a>' ),
			"description"  => "<div id='focuskwresults'></div>",
		);
		$mbs['title']          = array(
			"name"        => "title",
			"std"         => "",
			"type"        => "text",
			"title"       => __( "SEO Title", 'wordpress-seo' ),
			"description" => sprintf( __( "Title display in search engines is limited to 70 chars, %s chars left.", 'wordpress-seo' ), "<span id='yoast_wpseo_title-length'></span>" ),
			"help"        => __( "The SEO Title defaults to what is generated based on this sites title template for this posttype.", 'wordpress-seo' )
		);
		$mbs['metadesc']       = array(
			"name"        => "metadesc",
			"std"         => "",
			"class"       => "metadesc",
			"type"        => "textarea",
			"title"       => __( "Meta Description", 'wordpress-seo' ),
			"rows"        => 2,
			"richedit"    => false,
			"description" => sprintf( __( "The <code>meta</code> description will be limited to %s chars%s, %s chars left.", 'wordpress-seo' ), $this->meta_length, $this->meta_length_reason, "<span id='yoast_wpseo_metadesc-length'></span>" ) . " <div id='yoast_wpseo_metadesc_notice'></div>",
			"help"        => __( "If the meta description is empty, the snippet preview above shows what is generated based on this sites meta description template.", 'wordpress-seo' ),
		);
		if ( isset( $options['usemetakeywords'] ) && $options['usemetakeywords'] ) {
			$mbs['metakeywords'] = array(
				"name"        => "metakeywords",
				"std"         => "",
				"class"       => "metakeywords",
				"type"        => "text",
				"title"       => __( "Meta Keywords", 'wordpress-seo' ),
				"description" => sprintf( __( "If you type something above it will override your %smeta keywords template%s.", 'wordpress-seo' ), "<a target='_blank' href='" . admin_url( 'admin.php?page=wpseo_titles#' . esc_url( $post_type ) ) . "'>", "</a>" )
			);
		}

		// Apply filters before entering the advanced section
		$mbs = apply_filters( 'wpseo_metabox_entries', $mbs );

		return $mbs;
	}

	/**
	 * Retrieve the meta boxes for the advanced tab.
	 *
	 * @return array
	 */
	function get_advanced_meta_boxes() {
		global $post;

		$post_type = '';
		if ( isset( $post->post_type ) )
			$post_type = $post->post_type;
		else if ( !isset( $post->post_type ) && isset( $_GET['post_type'] ) )
			$post_type = $_GET['post_type'];

		$options = get_wpseo_options();

		$mbs = array();

		$mbs['meta-robots-noindex']  = array(
			"name"    => "meta-robots-noindex",
			"std"     => "-",
			"title"   => __( "Meta Robots Index", 'wordpress-seo' ),
			"type"    => "select",
			"options" => array(
				"0" => sprintf( __( "Default for post type, currently: %s", 'wordpress-seo' ), ( isset( $options['noindex-' . $post_type] ) && $options['noindex-' . $post_type] ) ? 'noindex' : 'index' ),
				"2" => "index",
				"1" => "noindex",
			),
		);
		$mbs['meta-robots-nofollow'] = array(
			"name"    => "meta-robots-nofollow",
			"std"     => "follow",
			"title"   => __( "Meta Robots Follow", 'wordpress-seo' ),
			"type"    => "radio",
			"options" => array(
				"0" => __( "Follow", 'wordpress-seo' ),
				"1" => __( "Nofollow", 'wordpress-seo' ),
			),
		);
		$mbs['meta-robots-adv']      = array(
			"name"        => "meta-robots-adv",
			"std"         => "none",
			"type"        => "multiselect",
			"title"       => __( "Meta Robots Advanced", 'wordpress-seo' ),
			"description" => __( "Advanced <code>meta</code> robots settings for this page.", 'wordpress-seo' ),
			"options"     => array(
				"noodp"     => __( "NO ODP", 'wordpress-seo' ),
				"noydir"    => __( "NO YDIR", 'wordpress-seo' ),
				"noarchive" => __( "No Archive", 'wordpress-seo' ),
				"nosnippet" => __( "No Snippet", 'wordpress-seo' ),
			),
		);
		if ( isset( $options['breadcrumbs-enable'] ) && $options['breadcrumbs-enable'] ) {
			$mbs['bctitle'] = array(
				"name"        => "bctitle",
				"std"         => "",
				"type"        => "text",
				"title"       => __( "Breadcrumbs title", 'wordpress-seo' ),
				"description" => __( "Title to use for this page in breadcrumb paths", 'wordpress-seo' ),
			);
		}
		if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] ) {
			$mbs['sitemap-include'] = array(
				"name"        => "sitemap-include",
				"std"         => "-",
				"type"        => "select",
				"title"       => __( "Include in Sitemap", 'wordpress-seo' ),
				"description" => __( "Should this page be in the XML Sitemap at all times, regardless of Robots Meta settings?", 'wordpress-seo' ),
				"options"     => array(
					"-"      => __( "Auto detect", 'wordpress-seo' ),
					"always" => __( "Always include", 'wordpress-seo' ),
					"never"  => __( "Never include", 'wordpress-seo' ),
				),
			);
			$mbs['sitemap-prio']    = array(
				"name"        => "sitemap-prio",
				"std"         => "-",
				"type"        => "select",
				"title"       => __( "Sitemap Priority", 'wordpress-seo' ),
				"description" => __( "The priority given to this page in the XML sitemap.", 'wordpress-seo' ),
				"options"     => array(
					"-"   => __( "Automatic prioritization", 'wordpress-seo' ),
					"1"   => __( "1 - Highest priority", 'wordpress-seo' ),
					"0.9" => "0.9",
					"0.8" => "0.8 - " . __( "Default for first tier pages", 'wordpress-seo' ),
					"0.7" => "0.7",
					"0.6" => "0.6 - " . __( "Default for second tier pages and posts", 'wordpress-seo' ),
					"0.5" => "0.5 - " . __( "Medium priority", 'wordpress-seo' ),
					"0.4" => "0.4",
					"0.3" => "0.3",
					"0.2" => "0.2",
					"0.1" => "0.1 - " . __( "Lowest priority", 'wordpress-seo' ),
				),
			);
		}
		$mbs['sitemap-html-include'] = array(
			"name"        => "sitemap-html-include",
			"std"         => "-",
			"type"        => "select",
			"title"       => __( "Include in HTML Sitemap", 'wordpress-seo' ),
			"description" => __( "Should this page be in the HTML Sitemap at all times, regardless of Robots Meta settings?", 'wordpress-seo' ),
			"options"     => array(
				"-"      => __( "Auto detect", 'wordpress-seo' ),
				"always" => __( "Always include", 'wordpress-seo' ),
				"never"  => __( "Never include", 'wordpress-seo' ),
			),
		);
		$mbs['canonical']            = array(
			"name"        => "canonical",
			"std"         => "",
			"type"        => "text",
			"title"       => __( "Canonical URL", 'wordpress-seo' ),
			"description" => sprintf( __( "The canonical URL that this page should point to, leave empty to default to permalink. %sCross domain canonical%s supported too.", 'wordpress-seo' ), "<a target='_blank' href='http://googlewebmastercentral.blogspot.com/2009/12/handling-legitimate-cross-domain.html'>", "</a>" )
		);
		$mbs['redirect']             = array(
			"name"        => "redirect",
			"std"         => "",
			"type"        => "text",
			"title"       => __( "301 Redirect", 'wordpress-seo' ),
			"description" => __( "The URL that this page should redirect to.", 'wordpress-seo' )
		);

		// Apply filters for in advanced section
		$mbs = apply_filters( 'wpseo_metabox_entries_advanced', $mbs );

		return $mbs;
	}

	/**
	 * Output the meta box
	 */
	function meta_box() {
		if ( isset( $_GET['post'] ) ) {
			$post_id = (int) $_GET['post'];
			$post    = get_post( $post_id );
		} else {
			global $post;
		}

		$options = get_wpseo_options();

		?>
		<div class="wpseo-metabox-tabs-div">
		<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs">
			<li class="general"><a class="wpseo_tablink"
								   href="#wpseo_general"><?php _e( "General", 'wordpress-seo' ); ?></a></li>
			<li id="linkdex" class="linkdex"><a class="wpseo_tablink"
												href="#wpseo_linkdex"><?php _e( "Page Analysis", 'wordpress-seo' ); ?></a>
			</li>
			<li class="advanced"><a class="wpseo_tablink"
									href="#wpseo_advanced"><?php _e( "Advanced", 'wordpress-seo' ); ?></a></li>
			<?php do_action( 'wpseo_tab_header' ); ?>
		</ul>
		<?php
		$content = '';
		foreach ( $this->get_meta_boxes( $post->post_type ) as $meta_box ) {
			$content .= $this->do_meta_box( $meta_box );
		}
		$this->do_tab( 'general', __( 'General', 'wordpress-seo' ), $content );

		$this->do_tab( 'linkdex', __( 'Page Analysis', 'wordpress-seo' ), $this->linkdex_output( $post ) );

		if ( current_user_can( 'edit_users' ) || !isset( $options['disableadvanced_meta'] ) || !$options['disableadvanced_meta'] ) {
			$content = '';
			foreach ( $this->get_advanced_meta_boxes() as $meta_box ) {
				$content .= $this->do_meta_box( $meta_box );
			}
			$this->do_tab( 'advanced', __( 'Advanced', 'wordpress-seo' ), $content );
		}

		do_action( 'wpseo_tab_content' );

		echo '</div>';
	}

	/**
	 * Adds a line in the meta box
	 *
	 * @param array $meta_box Contains the vars based on which output is generated.
	 * @return string
	 */
	function do_meta_box( $meta_box ) {
		$content        = '';
		$meta_box_value = '';

		if ( !isset( $meta_box['name'] ) ) {
			$meta_box['name'] = '';
		} else {
			if ( wpseo_get_value( $meta_box['name'] ) !== false ) {
				$meta_box_value = wpseo_get_value( $meta_box['name'] );
			} else if ( isset( $meta_box['std'] ) ) {
				$meta_box_value = $meta_box['std'];
			}
			$meta_box['name'] = esc_attr( $meta_box['name'] );
		}

		$class = '';
		if ( !empty( $meta_box['class'] ) )
			$class = ' ' . $meta_box['class'];

		$placeholder = '';
		if ( isset( $meta_box['placeholder'] ) && !empty( $meta_box['placeholder'] ) )
			$placeholder = $meta_box['placeholder'];

		$help = '';
		if ( isset( $meta_box['help'] ) && $meta_box['help'] )
			$help = '<img src="' . WPSEO_URL . 'images/question-mark.png" class="alignright yoast_help" id="' . $meta_box['name'] . 'help" alt="' . esc_attr( $meta_box['help'] ) . '" />';

		$content .= '<tr>';
		$content .= '<th scope="row"><label for="yoast_wpseo_' . $meta_box['name'] . '">' . $meta_box['title'] . ':</label>' . $help . '</th>';
		$content .= '<td>';

		switch ( $meta_box['type'] ) {
			case "snippetpreview":
				$content .= $this->snippet();
				break;
			case "text":
				$ac = '';
				if ( isset( $meta_box['autocomplete'] ) && $meta_box['autocomplete'] == 'off' )
					$ac = 'autocomplete="off" ';
				$content .= '<input type="text" placeholder="' . esc_attr( $placeholder ) . '" id="yoast_wpseo_' . $meta_box['name'] . '" ' . $ac . 'name="yoast_wpseo_' . $meta_box['name'] . '" value="' . esc_attr( $meta_box_value ) . '" class="large-text"/><br />';
				break;
			case "textarea":
				$content .= '<textarea class="large-text" rows="3" id="yoast_wpseo_' . $meta_box['name'] . '" name="yoast_wpseo_' . $meta_box['name'] . '">' . esc_textarea( $meta_box_value ) . '</textarea>';
				break;
			case "select":
				$content .= '<select name="yoast_wpseo_' . $meta_box['name'] . '" id="yoast_wpseo_' . $meta_box['name'] . '" class="yoast' . $class . '">';
				foreach ( $meta_box['options'] as $val => $option ) {
					$selected = '';
					if ( $meta_box_value == $val )
						$selected = 'selected="selected"';
					$content .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
				}
				$content .= '</select>';
				break;
			case "multiselect":
				$selectedarr         = explode( ',', $meta_box_value );
				$meta_box['options'] = array( 'none' => 'None' ) + $meta_box['options'];
				$content .= '<select multiple="multiple" size="' . count( $meta_box['options'] ) . '" style="height: ' . ( count( $meta_box['options'] ) * 16 ) . 'px;" name="yoast_wpseo_' . $meta_box['name'] . '[]" id="yoast_wpseo_' . $meta_box['name'] . '" class="yoast' . $class . '">';
				foreach ( $meta_box['options'] as $val => $option ) {
					$selected = '';
					if ( in_array( $val, $selectedarr ) )
						$selected = 'selected="selected"';
					$content .= '<option ' . $selected . ' value="' . esc_attr( $val ) . '">' . esc_html( $option ) . '</option>';
				}
				$content .= '</select>';
				break;
			case "checkbox":
				$checked = '';
				if ( $meta_box_value == 'on' || $meta_box_value == true )
					$checked = 'checked="checked"';
				$expl = ( isset( $meta_box['expl'] ) ) ? esc_html( $meta_box['expl'] ) : '';
				$content .= '<input type="checkbox" id="yoast_wpseo_' . $meta_box['name'] . '" name="yoast_wpseo_' . $meta_box['name'] . '" ' . $checked . ' class="yoast' . $class . '"/> ' . $expl . '<br />';
				break;
			case "radio":
				if ( $meta_box_value == '' )
					$meta_box_value = $meta_box['std'];
				foreach ( $meta_box['options'] as $val => $option ) {
					$selected = '';
					if ( $meta_box_value == $val )
						$selected = 'checked="checked"';
					$content .= '<input type="radio" ' . $selected . ' id="yoast_wpseo_' . $meta_box['name'] . '_' . esc_attr( $val ) . '" name="yoast_wpseo_' . $meta_box['name'] . '" value="' . esc_attr( $val ) . '"/> <label for="yoast_wpseo_' . $meta_box['name'] . '_' . $val . '">' . $option . '</label> ';
				}
				break;
			case "divtext":
				$content .= '<p>' . $meta_box['description'] . '</p>';
		}

		if ( isset( $meta_box['description'] ) )
			$content .= '<p>' . $meta_box['description'] . '</p>';

		$content .= '</td>';
		$content .= '</tr>';

		return $content;
	}

	/**
	 * Retrieve a post date when post is published, or return current date when it's not.
	 *
	 * @param object $post Post to retrieve the date for.
	 * @return string
	 */
	function get_post_date( $post ) {
		if ( isset( $post->post_date ) && $post->post_status == 'publish' )
			$date = date( 'j M Y', strtotime( $post->post_date ) );
		else
			$date = date( 'j M Y' );
		return $date;
	}

	/**
	 * Generate a snippet preview.
	 *
	 * @return string
	 */
	function snippet() {
		if ( isset( $_GET['post'] ) ) {
			$post_id = (int) $_GET['post'];
			$post    = get_post( $post_id );
		} else {
			global $post;
		}

		$options = get_wpseo_options();

		$date = '';
		if ( isset( $options['showdate-' . $post->post_type] ) && $options['showdate-' . $post->post_type] )
			$date = $this->get_post_date( $post );

		$title = wpseo_get_value( 'title' );
		$desc  = wpseo_get_value( 'metadesc' );

		$slug = $post->post_name;
		if ( empty( $slug ) )
			$slug = sanitize_title( $title );

		if ( !empty( $date ) )
			$datestr = '<span style="color: #666;">' . $date . '</span> – ';
		else
			$datestr = '';
		$content = '<div id="wpseosnippet">
			<a class="title" href="#">' . esc_html( $title ) . '</a><br/>';

//		if ( isset( $options['breadcrumbs-enable'] ) && $options['breadcrumbs-enable'] == 'on' ) {
//			require_once WPSEO_PATH . '/frontend/class-breadcrumbs.php';
//			$content .= '<span href="#" style="font-size: 13px; color: #282; line-height: 15px;" class="breadcrumb">' . yoast_breadcrumb('','',false) . '</span>';
//		} else {
		$content .= '<a href="#" style="font-size: 13px; color: #282; line-height: 15px;" class="url">' . str_replace( 'http://', '', get_bloginfo( 'url' ) ) . '/' . esc_html( $slug ) . '/</a>';
//		}
//		if ( $gplus = $this->get_gplus_data( $post->post_author ) ) {
//			//		$content .= '<a href="https://profiles.google.com/' . $gplus->id . '" style="text-decoration:none;line-height:15px;font-size:13px;font-family:arial,sans-serif">';
//			$content .= '<div style="margin-top: 5px; position: relative;"><img style="float: left; margin-right:8px;" src="' . str_replace( 'sz=50', 'sz=44', $gplus->image->url ) . '"/>';
//			$content .= '<p class="desc" style="width: 460px; float: left; font-size: 13px; color: #000; line-height: 15px;">';
//			$content .= '<span style="color: #666;">by ' . $gplus->displayName . ' - in 12,345 circles - More by ' . $gplus->displayName . '</span><br/>';
//			$content .= $datestr . '<span class="content">' . $desc . '</span></p>';
//			$content .= '<div style="clear:both;"></div>';
////		$content .= '<div class="f" style="display:inline;margin-top:-10px;padding:2px 0;color:#666;font-size:13px">by ' . $gplus->displayName . ' - More by ' . $gplus->displayName . '</div></a>';
////		$content .= '</div>';
//
////		echo '<pre>'.print_r($gplus,1).'</pre>';
//
//		} else {
		$content .= '<p class="desc" style="font-size: 13px; color: #000; line-height: 15px;">' . $datestr . '<span class="content">' . esc_html( $desc ) . '</span></p>';
//		}
		$content .= '</div>';

//		$content .= '<pre>' . print_r( $gplus, 1 ) . '</pre>';

		$content = apply_filters( 'wpseo_snippet', $content, $post, compact( 'title', 'desc', 'date', 'slug' ) );

		return $content;
	}

	/**
	 * Grab a users G+ data
	 *
	 * @since 1.2.9
	 *
	 * @param int $user_id The ID of the user to retrieve the data for.
	 *
	 * @return object $gplus An object with the users Google+ data.
	 */
	function get_gplus_data( $user_id ) {
		if ( $gplus = get_transient( 'gplus_' . $user_id ) )
			return $gplus;

		$gplus_profile = get_the_author_meta( 'googleplus', $user_id );

		if ( empty( $gplus_profile ) )
			return false;
		if ( preg_match( '|u/0/([^/]+)/|', $gplus_profile, $match ) )
			$gplus_id = $match[1];
		else if ( preg_match( '|\.com/(\d+)|', $gplus_profile, $match ) )
			$gplus_id = $match[1];
		else
			return false;

		$args = array(
			'headers' => array(
				'Referer' => 'http://yoast.com/wp-admin/',
			),
		);

		$resp = wp_remote_get( 'https://www.googleapis.com/plus/v1/people/' . $gplus_id . '?key=AIzaSyBLYmCW10gzW63ob8NYIPTneph1arsxqWs', $args );
		if ( !is_wp_error( $resp ) ) {
			$gplus = json_decode( $resp['body'] );

			set_transient( 'gplus_' . $user_id, $gplus, ( 7 * 24 * 60 * 60 ) );

			return $gplus;
		} else {
			return false;
		}

	}

	/**
	 * Save the WP SEO metadata for posts.
	 *
	 * @param int $post_id
	 * @return mixed
	 */
	function save_postdata( $post_id ) {

		if ( $post_id == null )
			return false;

		if ( wp_is_post_revision( $post_id ) )
			$post_id = wp_is_post_revision( $post_id );

		clean_post_cache( $post_id );
		$post = get_post( $post_id );

		$metaboxes = array_merge( $this->get_meta_boxes( $post->post_type ), $this->get_advanced_meta_boxes() );

		$metaboxes = apply_filters( 'wpseo_save_metaboxes', $metaboxes );

		foreach ( $metaboxes as $meta_box ) {
			if ( !isset( $meta_box['name'] ) )
				continue;

			if ( 'checkbox' == $meta_box['type'] ) {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
					$data = 'on';
				else
					$data = 'off';
			} else if ( 'multiselect' == $meta_box['type'] ) {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) ) {
					if ( is_array( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
						$data = implode( ",", $_POST['yoast_wpseo_' . $meta_box['name']] );
					else
						$data = $_POST['yoast_wpseo_' . $meta_box['name']];
				} else {
					continue;
				}
			} else {
				if ( isset( $_POST['yoast_wpseo_' . $meta_box['name']] ) )
					$data = $_POST['yoast_wpseo_' . $meta_box['name']];
				else
					continue;
			}

			wpseo_set_value( $meta_box['name'], sanitize_text_field( $data ), $post_id );
		}

		$this->calculate_results( $post );

		do_action( 'wpseo_saved_postdata' );
	}

	/**
	 * Enqueues all the needed JS and CSS.
	 */
	public function enqueue() {
		$color = get_user_meta( get_current_user_id(), 'admin_color', true );
		if ( '' == $color )
			$color = 'fresh';

		global $pagenow;
		if ( $pagenow == 'edit.php' ) {
			wp_enqueue_style( 'edit-page', WPSEO_URL . 'css/edit-page.css', WPSEO_VERSION );
		} else {
			wp_enqueue_style( 'metabox-tabs', WPSEO_URL . 'css/metabox-tabs.css', WPSEO_VERSION );
			wp_enqueue_style( "metabox-$color", WPSEO_URL . 'css/metabox-' . esc_attr( $color ) . '.css', WPSEO_VERSION );

			wp_enqueue_script( 'jquery-ui-autocomplete', WPSEO_URL . 'js/jquery-ui-autocomplete.min.js', array( 'jquery', 'jquery-ui-core' ), WPSEO_VERSION, true );
			wp_enqueue_script( 'jquery-qtip', WPSEO_URL . 'js/jquery.qtip.min.js', array( 'jquery' ), '1.0.0-RC3', true );
			wp_enqueue_script( 'wp-seo-metabox', WPSEO_URL . 'js/wp-seo-metabox.js', array( 'jquery', 'jquery-ui-core', 'jquery-ui-autocomplete' ), WPSEO_VERSION, true );
		}
	}

	/**
	 * Adds a dropdown that allows filtering on the posts SEO Quality.
	 *
	 * @return bool
	 */
	function posts_filter_dropdown() {
		global $pagenow;
		if ( $pagenow == 'upload.php' )
			return false;

		echo '<select name="seo_filter">';
		echo '<option value="">All SEO Scores</option>';
		foreach ( array(
					  'na'      => __( 'SEO: No Focus Keyword', 'wordpress-seo' ),
					  'bad'     => __( 'SEO: Bad', 'wordpress-seo' ),
					  'poor'    => __( 'SEO: Poor', 'wordpress-seo' ),
					  'ok'      => __( 'SEO: OK', 'wordpress-seo' ),
					  'good'    => __( 'SEO: Good', 'wordpress-seo' ),
					  'noindex' => __( 'SEO: Post Noindexed', 'wordpress-seo' )
				  ) as $val => $text ) {
			$sel = '';
			if ( isset( $_GET['seo_filter'] ) && $_GET['seo_filter'] == $val )
				$sel = 'selected ';
			echo '<option ' . $sel . 'value="' . $val . '">' . $text . '</option>';
		}
		echo '</select>';
	}

	/**
	 * Adds the column headings for the SEO plugin for edit posts / pages overview
	 *
	 * @param array $columns Already existing columns.
	 * @return array
	 */
	function column_heading( $columns ) {
		return array_merge( $columns, array( 'wpseo-score' => __( 'SEO', 'wordpress-seo' ), 'wpseo-title' => __( 'SEO Title', 'wordpress-seo' ), 'wpseo-metadesc' => __( 'Meta Desc.', 'wordpress-seo' ), 'wpseo-focuskw' => __( 'Focus KW', 'wordpress-seo' ) ) );
	}

	/**
	 * Display the column content for the given column
	 *
	 * @param string $column_name Column to display the content for.
	 * @param int    $post_id     Post to display the column content for.
	 */
	function column_content( $column_name, $post_id ) {
		if ( $column_name == 'wpseo-score' ) {
			if ( wpseo_get_value( 'meta-robots-noindex', $post_id ) == 1 ) {
				$score = 'noindex';
				$title = __( 'Post is set to noindex.', 'wordpress-seo' );
				if ( wpseo_get_value( 'meta-robots-noindex', $post_id ) !== 0 )
					wpseo_set_value( 'linkdex', 0, $post_id );
			} else if ( $score = wpseo_get_value( 'linkdex', $post_id ) ) {
				$score = wpseo_translate_score( round( $score / 10 ) );
				$title = $score;
			} else {
				$this->calculate_results( get_post( $post_id ) );
				$score = wpseo_get_value( 'linkdex', $post_id );
				if ( !$score || empty( $score ) ) {
					$score = 'na';
					$title = __( 'Focus keyword not set.', 'wordpress-seo' );
				} else {
					$score = wpseo_translate_score( $score );
					$title = $score;
				}
			}

			echo '<div title="' . $title . '" alt="' . $title . '" class="wpseo_score_img ' . esc_attr( $score ) . '"></div>';
		}
		if ( $column_name == 'wpseo-title' ) {
			echo esc_html( apply_filters( 'wpseo_title', $this->page_title( $post_id ) ) );
		}
		if ( $column_name == 'wpseo-metadesc' ) {
			echo esc_html( apply_filters( 'wpseo_metadesc', wpseo_get_value( 'metadesc', $post_id ) ) );
		}
		if ( $column_name == 'wpseo-focuskw' ) {
			$focuskw = wpseo_get_value( 'focuskw', $post_id );
			echo esc_html( $focuskw );
		}
	}

	/**
	 * Indicate which of the SEO columns are sortable.
	 *
	 * @param array $columns appended with their orderby variable.
	 * @return array
	 */
	function column_sort( $columns ) {
		$columns['wpseo-score']    = 'wpseo-score';
		$columns['wpseo-metadesc'] = 'wpseo-metadesc';
		$columns['wpseo-focuskw']  = 'wpseo-focuskw';
		return $columns;
	}

	/**
	 * Modify the query based on the seo_filter variable in $_GET
	 *
	 * @param array $vars Query variables.
	 * @return array
	 */
	function column_sort_orderby( $vars ) {
		if ( isset( $_GET['seo_filter'] ) ) {
			$noindex = false;
			$high    = false;
			switch ( $_GET['seo_filter'] ) {
				case 'noindex':
					$low     = false;
					$noindex = true;
					break;
				case 'na':
					$low  = 0;
					$high = 0;
					break;
				case 'bad':
					$low  = 1;
					$high = 34;
					break;
				case 'poor':
					$low  = 35;
					$high = 54;
					break;
				case 'ok':
					$low  = 55;
					$high = 74;
					break;
				case 'good':
					$low  = 75;
					$high = 100;
					break;
				default:
					$low     = false;
					$high    = false;
					$noindex = false;
					break;
			}
			if ( $low !== false ) {
				$vars = array_merge(
					$vars,
					array(
						'meta_query' => array(
							'relation' => 'AND',
							array(
								'key'     => '_yoast_wpseo_meta-robots-noindex',
								'value'   => 1,
								'compare' => '!='
							),
							array(
								'key'     => '_yoast_wpseo_linkdex',
								'value'   => array( $low, $high ),
								'type'    => 'numeric',
								'compare' => 'BETWEEN'
							)
						)
					)
				);
			} else if ( $noindex ) {
				$vars = array_merge(
					$vars,
					array(
						'meta_query' => array(
							'relation' => 'AND',
							array(
								'key'     => '_yoast_wpseo_meta-robots-noindex',
								'value'   => 1,
								'compare' => '='
							),
						)
					)
				);
			}
		}
		if ( isset( $_GET['seo_kw_filter'] ) ) {
			$vars = array_merge( $vars, array(
				'post_type'  => 'any',
				'meta_key'   => '_yoast_wpseo_focuskw',
				'meta_value' => $_GET['seo_kw_filter'],
			) );
		}
		if ( isset( $vars['orderby'] ) && 'wpseo-score' == $vars['orderby'] ) {
			$vars = array_merge( $vars, array(
				'meta_key' => '_yoast_wpseo_linkdex',
				'orderby'  => 'meta_value_num'
			) );
		}
		if ( isset( $vars['orderby'] ) && 'wpseo-metadesc' == $vars['orderby'] ) {
			$vars = array_merge( $vars, array(
				'meta_key' => '_yoast_wpseo_metadesc',
				'orderby'  => 'meta_value'
			) );
		}
		if ( isset( $vars['orderby'] ) && 'wpseo-focuskw' == $vars['orderby'] ) {
			$vars = array_merge( $vars, array(
				'meta_key' => '_yoast_wpseo_focuskw',
				'orderby'  => 'meta_value'
			) );
		}

		return $vars;
	}

	/**
	 * Retrieve the page title.
	 *
	 * @param int $post_id Post to retrieve the title for.
	 * @return string
	 */
	function page_title( $post_id ) {
		$fixed_title = wpseo_get_value( 'title', $post_id );
		if ( $fixed_title ) {
			return $fixed_title;
		} else {
			$post    = get_post( $post_id );
			$options = get_wpseo_options();
			if ( isset( $options['title-' . $post->post_type] ) && !empty( $options['title-' . $post->post_type] ) )
				return wpseo_replace_vars( $options['title-' . $post->post_type], (array) $post );
			else
				return wpseo_replace_vars( '%%title%%', (array) $post );
		}
	}

	/**
	 * Sort an array by a given key.
	 *
	 * @param array  $array Array to sort, array is returned sorted.
	 * @param string $key   Key to sort array by.
	 */
	function aasort( &$array, $key ) {
		$sorter = array();
		$ret    = array();
		reset( $array );
		foreach ( $array as $ii => $va ) {
			$sorter[$ii] = $va[$key];
		}
		asort( $sorter );
		foreach ( $sorter as $ii => $va ) {
			$ret[$ii] = $array[$ii];
		}
		$array = $ret;
	}

	/**
	 * Output the page analysis results.
	 *
	 * @param object $post Post to output the page analysis results for.
	 * @return string
	 */
	function linkdex_output( $post ) {
		$results = $this->calculate_results( $post );

		if ( is_wp_error( $results ) ) {
			$error = $results->get_error_messages();
			return '<div class="wpseo_msg"><p><strong>' . esc_html( $error[0] ) . '</strong></p></div>';
		}

		$output = '<table class="wpseoanalysis">';

		$perc_score = absint( wpseo_get_value( 'linkdex' ) );

		foreach ( $results as $result ) {
			$score = wpseo_translate_score( $result['val'] );
			$output .= '<tr><td class="score"><div class="wpseo_score_img ' . esc_attr( $score ) . '"></div></td><td>' . $result['msg'] . '</td></tr>';
		}
		$output .= '</table>';

		if ( WP_DEBUG )
			$output .= '<p><small>(' . $perc_score . '%)</small></p>';

		$output = '<div class="wpseo_msg"><p>' . __( 'To update this page analysis, save as draft or update and check this tab again', 'wordpress-seo' ) . '.</p></div>' . $output;

		unset( $results );

		return $output;
	}

	/**
	 * Calculate the page analysis results for post.
	 *
	 * @param object $post Post to calculate the results for.
	 * @return array
	 */
	function calculate_results( $post ) {
		$options = get_wpseo_options();

		if ( !class_exists( 'DOMDocument' ) ) {
			$result = new WP_Error( 'no-domdocument', sprintf( __( "Your hosting environment does not support PHP's %sDocument Object Model%s.", 'wordpress-seo' ), '<a href="http://php.net/manual/en/book.dom.php">', '</a>' ) . ' ' . __( "To enjoy all the benefits of the page analysis feature, you'll need to (get your host to) install it.", 'wordpress-seo' ) );
			return $result;
		}

		if ( !wpseo_get_value( 'focuskw', $post->ID ) ) {
			$result = new WP_Error( 'no-focuskw', sprintf( __( 'No focus keyword was set for this %s. If you do not set a focus keyword, no score can be calculated.', 'wordpress-seo' ), $post->post_type ) );

			wpseo_set_value( 'linkdex', 0, $post->ID );

			return $result;
		}

		$results = array();
		$job     = array();

		$sampleurl             = get_sample_permalink( $post );
		$job["pageUrl"]        = preg_replace( '/%(post|page)name%/', $sampleurl[1], $sampleurl[0] );
		$job["pageSlug"]       = urldecode( $post->post_name );
		$job["keyword"]        = trim( wpseo_get_value( 'focuskw' ) );
		$job["keyword_folded"] = $this->strip_separators_and_fold( $job["keyword"] );
		$job["post_id"]        = $post->ID;

		$dom                      = new domDocument;
		$dom->strictErrorChecking = false;
		$dom->preserveWhiteSpace  = false;
		@$dom->loadHTML( $post->post_content );
		$xpath = new DOMXPath( $dom );

		$statistics = new Yoast_TextStatistics;

		// Check if this focus keyword has been used already.
		$this->check_double_focus_keyword( $job, $results );

		// Keyword
		$this->score_keyword( $job['keyword'], $results );

		// Title
		if ( wpseo_get_value( 'title' ) ) {
			$job['title'] = wpseo_get_value( 'title' );
		} else {
			if ( isset( $options['title-' . $post->post_type] ) && $options['title-' . $post->post_type] != '' )
				$title_template = $options['title-' . $post->post_type];
			else
				$title_template = '%%title%% - %%sitename%%';
			$job['title'] = wpseo_replace_vars( $title_template, (array) $post );
		}
		$this->score_title( $job, $results, $statistics );

		// Meta description
		$description = '';
		if ( wpseo_get_value( 'metadesc' ) ) {
			$description = wpseo_get_value( 'metadesc' );
		} else {
			if ( isset( $options['metadesc-' . $post->post_type] ) && !empty( $options['metadesc-' . $post->post_type] ) )
				$description = wpseo_replace_vars( $options['metadesc-' . $post->post_type], (array) $post );
		}

		$meta_length = apply_filters( 'wpseo_metadesc_length', 156, $post );

		$this->score_description( $job, $results, $description, $statistics, $meta_length );
		unset( $description );

		// Body
		$body   = $this->get_body( $post );
		$firstp = $this->get_first_paragraph( $post );
		$this->score_body( $job, $results, $body, $firstp, $statistics );
		unset( $body );
		unset( $firstp );

		// URL
		$this->score_url( $job, $results, $statistics );

		// Headings
		$headings = $this->get_headings( $post->post_content );
		$this->score_headings( $job, $results, $headings );
		unset( $headings );

		// Images
		$imgs          = array();
		$imgs['count'] = substr_count( $post->post_content, '<img' );
		$imgs          = $this->get_images_alt_text( $post, $imgs );
		$this->score_images_alt_text( $job, $results, $imgs );
		unset( $imgs );

		// Anchors
		$anchors = $this->get_anchor_texts( $xpath );
		$count   = $this->get_anchor_count( $xpath );
		$this->score_anchor_texts( $job, $results, $anchors, $count );
		unset( $anchors, $count, $dom );

		$results = apply_filters( 'wpseo_linkdex_results', $results, $job, $post );

		$this->aasort( $results, 'val' );

		$overall     = 0;
		$overall_max = 0;

		foreach ( $results as $result ) {
			$overall += $result['val'];
			$overall_max += 9;
		}

		if ( $overall < 1 )
			$overall = 1;
		$score = round( ( $overall / $overall_max ) * 100 );

		wpseo_set_value( 'linkdex', absint( $score ), $post->ID );

		return $results;
	}

	/**
	 * Save the score result to the results array.
	 *
	 * @param array  $results      The results array used to store results.
	 * @param int    $scoreValue   The score value.
	 * @param string $scoreMessage The score message.
	 * @param string $scoreLabel   The label of the score to use in the results array.
	 * @param string $rawScore     The raw score, to be used by other filters.
	 */
	function save_score_result( &$results, $scoreValue, $scoreMessage, $scoreLabel, $rawScore = null ) {
		$score                = array(
			'val' => $scoreValue,
			'msg' => $scoreMessage,
			'raw' => $rawScore
		);
		$results[$scoreLabel] = $score;
	}

	/**
	 * Clean up the input string.
	 *
	 * @param string $inputString              String to clean up.
	 * @param bool   $removeOptionalCharacters Whether or not to do a cleanup of optional chars too.
	 * @return string
	 */
	function strip_separators_and_fold( $inputString, $removeOptionalCharacters = false ) {
		$keywordCharactersAlwaysReplacedBySpace = array( ",", "'", "\"", "?", "’", "“", "”", "|", "/" );
		$keywordCharactersRemovedOrReplaced     = array( "_", "-" );
		$keywordWordsRemoved                    = array( " a ", " in ", " an ", " on ", " for ", " the ", " and " );

		// lower
		$inputString = $this->strtolower_utf8( $inputString );

		// default characters replaced by space
		$inputString = str_replace( $keywordCharactersAlwaysReplacedBySpace, ' ', $inputString );

		// standardise whitespace
		$inputString = preg_replace( '/\s+/', ' ', $inputString );

		// deal with the separators that can be either removed or replaced by space
		if ( $removeOptionalCharacters ) {
			// remove word separators with a space
			$inputString = str_replace( $keywordWordsRemoved, ' ', $inputString );

			$inputString = str_replace( $keywordCharactersRemovedOrReplaced, '', $inputString );
		} else {
			$inputString = str_replace( $keywordCharactersRemovedOrReplaced, ' ', $inputString );
		}

		// standardise whitespace again
		$inputString = preg_replace( '/\s+/', ' ', $inputString );

		return trim( $inputString );
	}

	/**
	 * Check whether this focus keyword has been used for other posts before.
	 *
	 * @param array $job
	 * @param array $results
	 */
	function check_double_focus_keyword( $job, &$results ) {
		$posts = get_posts(
			array(
				'meta_key'    => '_yoast_wpseo_focuskw',
				'meta_value'  => $job['keyword'],
				'exclude'     => $job['post_id'],
				'fields'      => 'ids',
				'post_type'   => 'any',
				'numberposts' => -1
			)
		);

		if ( count( $posts ) == 0 )
			$this->save_score_result( $results, 9, __( "You've never used this focus keyword before, very good." ), 'keyword_overused' );
		else if ( count( $posts ) == 1 )
			$this->save_score_result( $results, 6, sprintf( __( 'You\'ve used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword.' ), '<a href="' . admin_url( 'post.php?post=' . $posts[0] . '&action=edit' ) . '">', '</a>' ), 'keyword_overused' );
		else
			$this->save_score_result( $results, 1, sprintf( __( 'You\'ve used this focus keyword %3$s%4$d times before%2$s, it\'s probably a good idea to read %1$sthis post on cornerstone content%2$s and improve your keyword strategy.' ), '<a href="http://yoast.com/cornerstone-content-rank/">', '</a>', '<a href="' . admin_url( 'edit.php?seo_kw_filter=' . urlencode( $job['keyword'] ) ) . '">', count( $posts ) ), 'keyword_overused' );
	}

	/**
	 * Check whether the keyword contains stopwords.
	 *
	 * @param string $keyword The keyword to check for stopwords.
	 * @param array  $results The results array.
	 */
	function score_keyword( $keyword, &$results ) {
		global $wpseo_admin;

		$keywordStopWord = __( "The keyword for this page contains one or more %sstop words%s, consider removing them. Found '%s'.", 'wordpress-seo' );

		if ( $wpseo_admin->stopwords_check( $keyword ) !== false )
			$this->save_score_result( $results, 5, sprintf( $keywordStopWord, "<a href=\"http://en.wikipedia.org/wiki/Stop_words\">", "</a>", $wpseo_admin->stopwords_check( $keyword ) ), 'keyword_stopwords' );
	}

	/**
	 * Check whether the keyword is contained in the URL.
	 *
	 * @param array  $job        The job array holding both the keyword and the URLs.
	 * @param array  $results    The results array.
	 * @param object $statistics Object of class Yoast_TextStatistics used to calculate lengths.
	 */
	function score_url( $job, &$results, $statistics ) {
		global $wpseo_admin;

		$urlGood      = __( "The keyword / phrase appears in the URL for this page.", 'wordpress-seo' );
		$urlMedium    = __( "The keyword / phrase does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!", 'wordpress-seo' );
		$urlStopWords = __( "The slug for this page contains one or more <a href=\"http://en.wikipedia.org/wiki/Stop_words\">stop words</a>, consider removing them.", 'wordpress-seo' );
		$longSlug     = __( "The slug for this page is a bit long, consider shortening it.", 'wordpress-seo' );

		$needle    = $this->strip_separators_and_fold( $job["keyword"] );
		$haystack1 = $this->strip_separators_and_fold( $job["pageUrl"], true );
		$haystack2 = $this->strip_separators_and_fold( $job["pageUrl"], false );

		if ( stripos( $haystack1, $needle ) || stripos( $haystack2, $needle ) )
			$this->save_score_result( $results, 9, $urlGood, 'url_keyword' );
		else
			$this->save_score_result( $results, 6, $urlMedium, 'url_keyword' );

		// Check for Stop Words in the slug
		if ( $wpseo_admin->stopwords_check( $job["pageSlug"], true ) !== false )
			$this->save_score_result( $results, 5, $urlStopWords, 'url_stopword' );

		// Check if the slug isn't too long relative to the length of the keyword
		if ( ( $statistics->text_length( $job["keyword"] ) + 20 ) < $statistics->text_length( $job["pageSlug"] ) && 40 < $statistics->text_length( $job["pageSlug"] ) )
			$this->save_score_result( $results, 5, $longSlug, 'url_length' );
	}

	/**
	 * Check whether the keyword is contained in the title.
	 *
	 * @param array  $job        The job array holding both the keyword versions.
	 * @param array  $results    The results array.
	 * @param object $statistics Object of class Yoast_TextStatistics used to calculate lengths.
	 */
	function score_title( $job, &$results, $statistics ) {
		$scoreTitleMinLength    = 40;
		$scoreTitleMaxLength    = 70;
		$scoreTitleKeywordLimit = 0;

		$scoreTitleMissing          = __( "Please create a page title.", 'wordpress-seo' );
		$scoreTitleCorrectLength    = __( "The page title is more than 40 characters and less than the recommended 70 character limit.", 'wordpress-seo' );
		$scoreTitleTooShort         = __( "The page title contains %d characters, which is less than the recommended minimum of 40 characters. Use the space to add keyword variations or create compelling call-to-action copy.", 'wordpress-seo' );
		$scoreTitleTooLong          = __( "The page title contains %d characters, which is more than the viewable limit of 70 characters; some words will not be visible to users in your listing.", 'wordpress-seo' );
		$scoreTitleKeywordMissing   = __( "The keyword / phrase %s does not appear in the page title.", 'wordpress-seo' );
		$scoreTitleKeywordBeginning = __( "The page title contains keyword / phrase, at the beginning which is considered to improve rankings.", 'wordpress-seo' );
		$scoreTitleKeywordEnd       = __( "The page title contains keyword / phrase, but it does not appear at the beginning; try and move it to the beginning.", 'wordpress-seo' );

		if ( $job['title'] == "" ) {
			$this->save_score_result( $results, 1, $scoreTitleMissing, 'title' );
		} else {
			$length = $statistics->text_length( $job['title'] );
			if ( $length < $scoreTitleMinLength )
				$this->save_score_result( $results, 6, sprintf( $scoreTitleTooShort, $length ), 'title_length' );
			else if ( $length > $scoreTitleMaxLength )
				$this->save_score_result( $results, 6, sprintf( $scoreTitleTooLong, $length ), 'title_length' );
			else
				$this->save_score_result( $results, 9, $scoreTitleCorrectLength, 'title_length' );

			// TODO MA Keyword/Title matching is exact match with separators removed, but should extend to distributed match
			$needle_position = stripos( $job['title'], $job["keyword_folded"] );

			if ( $needle_position === false ) {
				$needle_position = stripos( $job['title'], $job["keyword"] );
			}

			if ( $needle_position === false )
				$this->save_score_result( $results, 2, sprintf( $scoreTitleKeywordMissing, $job["keyword_folded"] ), 'title_keyword' );
			else if ( $needle_position <= $scoreTitleKeywordLimit )
				$this->save_score_result( $results, 9, $scoreTitleKeywordBeginning, 'title_keyword' );
			else
				$this->save_score_result( $results, 6, $scoreTitleKeywordEnd, 'title_keyword' );
		}
	}

	/**
	 * Check whether the document contains outbound links and whether it's anchor text matches the keyword.
	 *
	 * @param array $job          The job array holding both the keyword versions.
	 * @param array $results      The results array.
	 * @param array $anchor_texts The array holding all anchors in the document.
	 * @param array $count        The number of anchors in the document, grouped by type.
	 */
	function score_anchor_texts( $job, &$results, $anchor_texts, $count ) {
		$scoreNoLinks               = __( "No outbound links appear in this page, consider adding some as appropriate.", 'wordpress-seo' );
		$scoreKeywordInOutboundLink = __( "You're linking to another page with the keyword you want this page to rank for, consider changing that if you truly want this page to rank.", 'wordpress-seo' );
		$scoreLinksDofollow         = __( "This page has %s outbound link(s).", 'wordpress-seo' );
		$scoreLinksNofollow         = __( "This page has %s outbound link(s), all nofollowed.", 'wordpress-seo' );
		$scoreLinks                 = __( "This page has %s nofollowed link(s) and %s normal outbound link(s).", 'wordpress-seo' );


		if ( $count['external']['nofollow'] == 0 && $count['external']['dofollow'] == 0 ) {
			$this->save_score_result( $results, 6, $scoreNoLinks, 'links' );
		} else {
			$found = false;
			foreach ( $anchor_texts as $anchor_text ) {
				if ( $this->strtolower_utf8( $anchor_text ) == $job["keyword_folded"] )
					$found = true;
			}
			if ( $found )
				$this->save_score_result( $results, 2, $scoreKeywordInOutboundLink, 'links_focus_keyword' );

			if ( $count['external']['nofollow'] == 0 && $count['external']['dofollow'] > 0 ) {
				$this->save_score_result( $results, 9, sprintf( $scoreLinksDofollow, $count['external']['dofollow'] ), 'links_number' );
			} else if ( $count['external']['nofollow'] > 0 && $count['external']['dofollow'] == 0 ) {
				$this->save_score_result( $results, 7, sprintf( $scoreLinksNofollow, $count['external']['nofollow'] ), 'links_number' );
			} else {
				$this->save_score_result( $results, 8, sprintf( $scoreLinks, $count['external']['nofollow'], $count['external']['dofollow'] ), 'links_number' );
			}
		}

	}

	/**
	 * Retrieve the anchor texts used in the current document.
	 *
	 * @param object $xpath An XPATH object of the current document.
	 * @return array
	 */
	function get_anchor_texts( &$xpath ) {
		$query        = "//a|//A";
		$dom_objects  = $xpath->query( $query );
		$anchor_texts = array();
		foreach ( $dom_objects as $dom_object ) {
			if ( $dom_object->attributes->getNamedItem( 'href' ) ) {
				$href = $dom_object->attributes->getNamedItem( 'href' )->textContent;
				if ( substr( $href, 0, 4 ) == 'http' )
					$anchor_texts['external'] = $dom_object->textContent;
			}
		}
		unset( $dom_objects );
		return $anchor_texts;
	}

	/**
	 * Count the number of anchors and group them by type.
	 *
	 * @param object $xpath An XPATH object of the current document.
	 * @return array
	 */
	function get_anchor_count( &$xpath ) {
		$query       = "//a|//A";
		$dom_objects = $xpath->query( $query );
		$count       = array(
			'total'    => 0,
			'internal' => array( 'nofollow' => 0, 'dofollow' => 0 ),
			'external' => array( 'nofollow' => 0, 'dofollow' => 0 ),
			'other'    => array( 'nofollow' => 0, 'dofollow' => 0 )
		);

		foreach ( $dom_objects as $dom_object ) {
			$count['total']++;
			if ( $dom_object->attributes->getNamedItem( 'href' ) ) {
				$href  = $dom_object->attributes->getNamedItem( 'href' )->textContent;
				$wpurl = get_bloginfo( 'url' );
				if ( substr( $href, 0, 1 ) == "/" || substr( $href, 0, strlen( $wpurl ) ) == $wpurl )
					$type = "internal";
				else if ( substr( $href, 0, 4 ) == 'http' )
					$type = "external";
				else
					$type = "other";
				if ( $dom_object->attributes->getNamedItem( 'rel' ) ) {
					$link_rel = $dom_object->attributes->getNamedItem( 'rel' )->textContent;
					if ( stripos( $link_rel, 'nofollow' ) !== false )
						$count[$type]['nofollow']++;
					else
						$count[$type]['dofollow']++;
				} else {
					$count[$type]['dofollow']++;
				}
			}
		}
		return $count;
	}

	/**
	 * Check whether the images alt texts contain the keyword.
	 *
	 * @param array $job     The job array holding both the keyword versions.
	 * @param array $results The results array.
	 * @param array $imgs    The array with images alt texts.
	 */
	function score_images_alt_text( $job, &$results, $imgs ) {
		$scoreImagesNoImages          = __( "No images appear in this page, consider adding some as appropriate.", 'wordpress-seo' );
		$scoreImagesNoAlt             = __( "The images on this page are missing alt tags.", 'wordpress-seo' );
		$scoreImagesAltKeywordIn      = __( "The images on this page contain alt tags with the target keyword / phrase.", 'wordpress-seo' );
		$scoreImagesAltKeywordMissing = __( "The images on this page do not have alt tags containing your keyword / phrase.", 'wordpress-seo' );

		if ( $imgs['count'] == 0 ) {
			$this->save_score_result( $results, 3, $scoreImagesNoImages, 'images_alt' );
		} else if ( count( $imgs['alts'] ) == 0 && $imgs['count'] != 0 ) {
			$this->save_score_result( $results, 5, $scoreImagesNoAlt, 'images_alt' );
		} else {
			$found = false;
			foreach ( $imgs['alts'] as $alt ) {
				$haystack1 = $this->strip_separators_and_fold( $alt, true );
				$haystack2 = $this->strip_separators_and_fold( $alt, false );
				if ( strrpos( $haystack1, $job["keyword_folded"] ) !== false )
					$found = true;
				else if ( strrpos( $haystack2, $job["keyword_folded"] ) !== false )
					$found = true;
			}
			if ( $found )
				$this->save_score_result( $results, 9, $scoreImagesAltKeywordIn, 'images_alt' );
			else
				$this->save_score_result( $results, 5, $scoreImagesAltKeywordMissing, 'images_alt' );
		}

	}

	/**
	 * Retrieve the alt texts from the images.
	 *
	 * @param object $post The post to find images in.
	 * @param array  $imgs The array holding the image information.
	 * @return array The updated images array.
	 */
	function get_images_alt_text( $post, $imgs ) {
		preg_match_all( '/<img[^>]+>/im', $post->post_content, $matches );
		$imgs['alts'] = array();
		foreach ( $matches[0] as $img ) {
			if ( preg_match( '/alt=("|\')(.*?)\1/', $img, $alt ) )
				$imgs['alts'][] = $this->strtolower_utf8( $alt[2] );
		}
		if ( preg_match_all( '/\[gallery/', $post->post_content, $matches ) ) {
			$attachments = get_children( array( 'post_parent' => $post->ID, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'fields' => 'ids' ) );
			foreach ( $attachments as $att_id ) {
				$alt = get_post_meta( $att_id, '_wp_attachment_image_alt', true );
				if ( $alt && !empty( $alt ) )
					$imgs['alts'][] = $alt;
				$imgs['count']++;
			}
		}
		return $imgs;
	}

	/**
	 * Score the headings for keyword appearance.
	 *
	 * @param array $job      The array holding the keywords.
	 * @param array $results  The results array.
	 * @param array $headings The headings found in the document.
	 */
	function score_headings( $job, &$results, $headings ) {
		$scoreHeadingsNone           = __( "No subheading tags (like an H2) appear in the copy.", 'wordpress-seo' );
		$scoreHeadingsKeywordIn      = __( "Keyword / keyphrase appears in %s (out of %s) subheadings in the copy. While not a major ranking factor, this is beneficial.", 'wordpress-seo' );
		$scoreHeadingsKeywordMissing = __( "You have not used your keyword / keyphrase in any subheading (such as an H2) in your copy.", 'wordpress-seo' );

		$headingCount = count( $headings );
		if ( $headingCount == 0 )
			$this->save_score_result( $results, 7, $scoreHeadingsNone, 'headings' );
		else {
			$found = 0;
			foreach ( $headings as $heading ) {
				$haystack1 = $this->strip_separators_and_fold( $heading, true );
				$haystack2 = $this->strip_separators_and_fold( $heading, false );

				if ( strrpos( $haystack1, $job["keyword_folded"] ) !== false )
					$found++;
				else if ( strrpos( $haystack2, $job["keyword_folded"] ) !== false )
					$found++;
			}
			if ( $found )
				$this->save_score_result( $results, 9, sprintf( $scoreHeadingsKeywordIn, $found, $headingCount ), 'headings' );
			else
				$this->save_score_result( $results, 3, $scoreHeadingsKeywordMissing, 'headings' );
		}
	}

	/**
	 * Fetch all headings and return their content.
	 *
	 * @param string $postcontent Post content to find headings in.
	 * @return array Array of heading texts.
	 */
	function get_headings( $postcontent ) {
		preg_match_all( '/<h([1-6])([^>]+)?>(.*)?<\/h\\1>/i', $postcontent, $matches );
		$headings = array();
		foreach ( $matches[3] as $heading ) {
			$headings[] = $this->strtolower_utf8( $heading );
		}
		return $headings;
	}

	/**
	 * Score the meta description for length and keyword appearance.
	 *
	 * @param array  $job         The array holding the keywords.
	 * @param array  $results     The results array.
	 * @param string $description The meta description.
	 * @param object $statistics  Object of class Yoast_TextStatistics used to calculate lengths.
	 * @param int    $maxlength   The maximum length of the meta description.
	 */
	function score_description( $job, &$results, $description, $statistics, $maxlength = 155 ) {
		$scoreDescriptionMinLength      = 120;
		$scoreDescriptionCorrectLength  = __( "In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?", 'wordpress-seo' );
		$scoreDescriptionTooShort       = __( "The meta description is under 120 characters, however up to %s characters are available. %s", 'wordpress-seo' );
		$scoreDescriptionTooLong        = __( "The specified meta description is over %s characters, reducing it will ensure the entire description is visible. %s", 'wordpress-seo' );
		$scoreDescriptionMissing        = __( "No meta description has been specified, search engines will display copy from the page instead.", 'wordpress-seo' );
		$scoreDescriptionKeywordIn      = __( "The meta description contains the primary keyword / phrase.", 'wordpress-seo' );
		$scoreDescriptionKeywordMissing = __( "A meta description has been specified, but it does not contain the target keyword / phrase.", 'wordpress-seo' );

		$metaShorter = '';
		if ( $maxlength != 155 )
			$metaShorter = __( "The available space is shorter than the usual 155 characters because Google will also include the publication date in the snippet.", 'wordpress-seo' );

		if ( $description == "" ) {
			$this->save_score_result( $results, 1, $scoreDescriptionMissing, 'description_length' );
		} else {
			$length = $statistics->text_length( $description );

			if ( $length < $scoreDescriptionMinLength )
				$this->save_score_result( $results, 6, sprintf( $scoreDescriptionTooShort, $maxlength, $metaShorter ), 'description_length' );
			else if ( $length <= $maxlength )
				$this->save_score_result( $results, 9, $scoreDescriptionCorrectLength, 'description_length' );
			else
				$this->save_score_result( $results, 6, sprintf( $scoreDescriptionTooLong, $maxlength, $metaShorter ), 'description_length' );

			// TODO MA Keyword/Title matching is exact match with separators removed, but should extend to distributed match
			$haystack1 = $this->strip_separators_and_fold( $description, true );
			$haystack2 = $this->strip_separators_and_fold( $description, false );
			if ( strrpos( $haystack1, $job["keyword_folded"] ) === false && strrpos( $haystack2, $job["keyword_folded"] ) === false )
				$this->save_score_result( $results, 3, $scoreDescriptionKeywordMissing, 'description_keyword' );
			else
				$this->save_score_result( $results, 9, $scoreDescriptionKeywordIn, 'description_keyword' );
		}
	}

	/**
	 * Score the body for length and keyword appearance.
	 *
	 * @param array  $job         The array holding the keywords.
	 * @param array  $results     The results array.
	 * @param string $body        The body.
	 * @param string $firstp      The first paragraph.
	 * @param object $statistics  Object of class Yoast_TextStatistics used to calculate lengths.
	 */
	function score_body( $job, &$results, $body, $firstp, $statistics ) {
		$scoreBodyGoodLimit = 300;
		$scoreBodyOKLimit   = 250;
		$scoreBodyPoorLimit = 200;
		$scoreBodyBadLimit  = 100;

		$scoreBodyGoodLength = __( "There are %d words contained in the body copy, this is greater than the 300 word recommended minimum.", 'wordpress-seo' );
		$scoreBodyPoorLength = __( "There are %d words contained in the body copy, this is below the 300 word recommended minimum. Add more useful content on this topic for readers.", 'wordpress-seo' );
		$scoreBodyOKLength   = __( "There are %d words contained in the body copy, this is slightly below the 300 word recommended minimum, add a bit more copy.", 'wordpress-seo' );
		$scoreBodyBadLength  = __( "There are %d words contained in the body copy. This is far too low and should be increased.", 'wordpress-seo' );

		$scoreKeywordDensityLow  = __( "The keyword density is %s%%, which is a bit low, the keyword was found %s times.", 'wordpress-seo' );
		$scoreKeywordDensityHigh = __( "The keyword density is %s%%, which is over the advised 4.5%% maximum, the keyword was found %s times.", 'wordpress-seo' );
		$scoreKeywordDensityGood = __( "The keyword density is %s%%, which is great, the keyword was found %s times.", 'wordpress-seo' );

		$scoreFirstParagraphLow  = __( "The keyword doesn't appear in the first paragraph of the copy, make sure the topic is clear immediately.", 'wordpress-seo' );
		$scoreFirstParagraphHigh = __( "The keyword appears in the first paragraph of the copy.", 'wordpress-seo' );

		$fleschurl   = '<a href="http://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease">' . __( 'Flesch Reading Ease', 'wordpress-seo' ) . '</a>';
		$scoreFlesch = __( "The copy scores %s in the %s test, which is considered %s to read. %s", 'wordpress-seo' );

		// Replace images with their alt tags, then strip all tags
		$body = preg_replace( '/(<img([^>]+)?alt="([^"]+)"([^>]+)>)/', '$3', $body );
		$body = strip_tags( $body );

		// Copy length check
		$wordCount = $statistics->word_count( $body );

		if ( $wordCount < $scoreBodyBadLimit )
			$this->save_score_result( $results, -20, sprintf( $scoreBodyBadLength, $wordCount ), 'body_length', $wordCount );
		else if ( $wordCount < $scoreBodyPoorLimit )
			$this->save_score_result( $results, -10, sprintf( $scoreBodyPoorLength, $wordCount ), 'body_length', $wordCount );
		else if ( $wordCount < $scoreBodyOKLimit )
			$this->save_score_result( $results, 5, sprintf( $scoreBodyPoorLength, $wordCount ), 'body_length', $wordCount );
		else if ( $wordCount < $scoreBodyGoodLimit )
			$this->save_score_result( $results, 7, sprintf( $scoreBodyOKLength, $wordCount ), 'body_length', $wordCount );
		else
			$this->save_score_result( $results, 9, sprintf( $scoreBodyGoodLength, $wordCount ), 'body_length', $wordCount );

		$body = $this->strtolower_utf8( $body );

		$keywordWordCount = str_word_count( $job["keyword"] );
		if ( $keywordWordCount > 10 ) {
			$this->save_score_result( $results, 0, __( 'Your keyphrase is over 10 words, a keyphrase should be shorter and there can be only one keyphrase.', 'wordpress-seo' ), 'focus_keyword_length' );
		} else {
			// Keyword Density check
			$keywordDensity = 0;
			if ( $wordCount > 100 ) {
				$keywordCount = preg_match_all( "/" . preg_quote( $job["keyword"], '/' ) . "/msiU", $body, $res );
				if ( $keywordCount > 0 && $keywordWordCount > 0 )
					$keywordDensity = number_format( ( ( $keywordCount / ( $wordCount - ( ( $keywordWordCount - 1 ) * $keywordWordCount ) ) ) * 100 ), 2 );
				if ( $keywordDensity < 1 ) {
					$this->save_score_result( $results, 4, sprintf( $scoreKeywordDensityLow, $keywordDensity, $keywordCount ), 'keyword_density' );
				} else if ( $keywordDensity > 4.5 ) {
					$this->save_score_result( $results, -50, sprintf( $scoreKeywordDensityHigh, $keywordDensity, $keywordCount ), 'keyword_density' );
				} else {
					$this->save_score_result( $results, 9, sprintf( $scoreKeywordDensityGood, $keywordDensity, $keywordCount ), 'keyword_density' );
				}
			}
		}

		$firstp = $this->strtolower_utf8( $firstp );

		// First Paragraph Test
		if ( stripos( $firstp, $job["keyword"] ) === false && stripos( $firstp, $job["keyword_folded"] ) === false ) {
			$this->save_score_result( $results, 3, $scoreFirstParagraphLow, 'keyword_first_paragraph' );
		} else {
			$this->save_score_result( $results, 9, $scoreFirstParagraphHigh, 'keyword_first_paragraph' );
		}

		$lang = get_bloginfo( 'language' );
		if ( substr( $lang, 0, 2 ) == 'en' && $wordCount > 100 ) {
			// Flesch Reading Ease check
			$flesch = $statistics->flesch_kincaid_reading_ease( $body );

			$note  = '';
			$level = '';
			$score = 1;
			if ( $flesch >= 90 ) {
				$level = __( 'very easy', 'wordpress-seo' );
				$score = 9;
			} else if ( $flesch >= 80 ) {
				$level = __( 'easy', 'wordpress-seo' );
				$score = 9;
			} else if ( $flesch >= 70 ) {
				$level = __( 'fairly easy', 'wordpress-seo' );
				$score = 8;
			} else if ( $flesch >= 60 ) {
				$level = __( 'OK', 'wordpress-seo' );
				$score = 7;
			} else if ( $flesch >= 50 ) {
				$level = __( 'fairly difficult', 'wordpress-seo' );
				$note  = __( 'Try to make shorter sentences to improve readability.', 'wordpress-seo' );
				$score = 6;
			} else if ( $flesch >= 30 ) {
				$level = __( 'difficult', 'wordpress-seo' );
				$note  = __( 'Try to make shorter sentences, using less difficult words to improve readability.', 'wordpress-seo' );
				$score = 5;
			} else if ( $flesch >= 0 ) {
				$level = __( 'very difficult', 'wordpress-seo' );
				$note  = __( 'Try to make shorter sentences, using less difficult words to improve readability.', 'wordpress-seo' );
				$score = 4;
			}
			$this->save_score_result( $results, $score, sprintf( $scoreFlesch, $flesch, $fleschurl, $level, $note ), 'flesch_kincaid' );
		}
	}

	/**
	 * Retrieve the body from the post.
	 *
	 * @param object $post The post object.
	 * @return string The post content.
	 */
	function get_body( $post ) {
		// Strip shortcodes, for obvious reasons
		$origHtml = wpseo_strip_shortcode( $post->post_content );

		if ( trim( $origHtml ) == '' )
			return '';

		$htmdata2 = preg_replace( "/\n|\r/", " ", $origHtml );
		if ( $htmdata2 == null )
			$htmdata2 = $origHtml;
		else
			unset( $origHtml );

		$htmdata3 = preg_replace( "/<(\x20*script|script).*?(\/>|\/script>)/", "", $htmdata2 );
		if ( $htmdata3 == null )
			$htmdata3 = $htmdata2;
		else
			unset( $htmdata2 );

		$htmdata4 = preg_replace( "/<!--.*?-->/", "", $htmdata3 );
		if ( $htmdata4 == null )
			$htmdata4 = $htmdata3;
		else
			unset( $htmdata3 );

		$htmdata5 = preg_replace( "/<(\x20*style|style).*?(\/>|\/style>)/", "", $htmdata4 );
		if ( $htmdata5 == null )
			$htmdata5 = $htmdata4;
		else
			unset( $htmdata4 );

		return $htmdata5;
	}

	/**
	 * Retrieve the first paragraph from the post.
	 *
	 * @param object $post The post to retrieve the first paragraph from.
	 * @return string
	 */
	function get_first_paragraph( $post ) {
		// To determine the first paragraph we first need to autop the content, then match the first paragraph and return.
		$res = preg_match( '/<p>(.*)<\/p>/', wpautop( $post->post_content ), $matches );
		if ( $res )
			return $matches[1];
		return false;
	}
}

$wpseo_metabox = new WPSEO_Metabox();