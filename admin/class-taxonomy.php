<?php
/**
 * @package Admin
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

/**
 * Class that handles the edit boxes on taxonomy edit pages.
 */
class WPSEO_Taxonomy {

	/**
	 * Class constructor
	 */
	function __construct() {
		$options = WPSEO_Options::get_all();

		if ( is_admin() && isset( $_GET['taxonomy'] ) &&
			( ! isset( $options['tax-hideeditbox-' . $_GET['taxonomy']] ) || $options['tax-hideeditbox-' . $_GET['taxonomy']] === false )
		)
			add_action( $_GET['taxonomy'] . '_edit_form', array( $this, 'term_seo_form' ), 10, 1 );

		add_action( 'edit_term', array( $this, 'update_term' ), 99, 3 );

		add_action( 'init', array( $this, 'custom_category_descriptions_allow_html' ) );
		add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );
	}
	
	/**
	 * Test whether we are on a public taxonomy - no metabox actions needed if we are not
	 * Unfortunately we have to hook most everything in before the point where all taxonomies are registered and
	 * we know which taxonomy is being requested, so we need to use this check in nearly every hooked in function.
	 *
	 * @since 1.5.0
	 */
	function tax_is_public() {
		// Don't make static as taxonomies may still be added during the run
		$taxonomies = get_taxonomies( array( 'public' => true ), 'names' );

		return ( isset( $_GET['taxonomy'] ) && in_array( $_GET['taxonomy'], $taxonomies ) );
	}

	/**
	 * Create a row in the form table.
	 *
	 * @param string $var      Variable the row controls.
	 * @param string $label    Label for the variable.
	 * @param string $desc     Description of the use of the variable.
	 * @param array  $tax_meta Taxonomy meta value.
	 * @param string $type     Type of form row to create.
	 * @param array  $options  Options to use when form row is a select box.
	 */
	function form_row( $var, $label, $desc, $tax_meta, $type = 'text', $options = array() ) {
		$val = '';
		if ( isset( $tax_meta[$var] ) && !empty( $tax_meta[$var] ) )
			$val = stripslashes( $tax_meta[$var] );

		echo '<tr class="form-field">' . "\n";
		echo "\t" . '<th scope="row" valign="top"><label for="' . $var . '">' . $label . ':</label></th>' . "\n";
		echo "\t" . '<td>' . "\n";
		if ( $type == 'text' ) {
			?>
        <input name="<?php echo $var; ?>" id="<?php echo $var; ?>" type="text" value="<?php echo $val; ?>" size="40"/>
        <p class="description"><?php echo $desc; ?></p>
		<?php
		} else if ( $type == 'checkbox' ) {
			?>
        <input name="<?php echo $var; ?>" id="<?php echo $var; ?>" type="checkbox" <?php checked( $val ); ?>/>
		<?php
		} else if ( $type == 'select' ) {
			?>
        <select name="<?php echo $var; ?>" id="<?php echo $var; ?>">
			<?php foreach ( $options as $option => $label ) {
			$sel = '';
			if ( $option == $val )
				$sel = " selected='selected'";
			echo "<option" . $sel . " value='" . $option . "'>" . $label . "</option>";
		}?>
        </select>
		<?php
		}
		echo "\t" . '</td>' . "\n";
		echo '</tr>' . "\n";

	}

	/**
	 * Show the SEO inputs for term.
	 *
	 * @param object $term Term to show the edit boxes for.
	 */
	function term_seo_form( $term ) {
		if( $this->tax_is_public() === false )
			return;

		$tax_meta = get_option( 'wpseo_taxonomy_meta' );
		$options  = WPSEO_Options::get_all();

		if ( isset( $tax_meta[$term->taxonomy][$term->term_id] ) )
			$tax_meta = $tax_meta[$term->taxonomy][$term->term_id];

		echo '<h2>' . __( 'Yoast WordPress SEO Settings', 'wordpress-seo' ) . '</h2>';
		echo '<table class="form-table">';

		$this->form_row( 'wpseo_title', __( 'SEO Title', 'wordpress-seo' ), __( 'The SEO title is used on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
		$this->form_row( 'wpseo_desc', __( 'SEO Description', 'wordpress-seo' ), __( 'The SEO description is used for the meta description on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
		if ( isset( $options['usemetakeywords'] ) && $options['usemetakeywords'] )
			$this->form_row( 'wpseo_metakey', __( 'Meta Keywords', 'wordpress-seo' ), __( 'Meta keywords used on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
		$this->form_row( 'wpseo_canonical', __( 'Canonical', 'wordpress-seo' ), __( 'The canonical link is shown on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
		$this->form_row( 'wpseo_bctitle', __( 'Breadcrumbs Title', 'wordpress-seo' ), sprintf( __( 'The Breadcrumbs title is used in the breadcrumbs where this %s appears.', 'wordpress-seo' ), $term->taxonomy ), $tax_meta );

		if ( isset( $tax_meta['wpseo_noindex'] ) && $tax_meta['wpseo_noindex'] == 'on' )
			$tax_meta['wpseo_noindex'] = 'noindex';
		$current         = ( isset( $options['noindex-' . $term->taxonomy] ) && $options['noindex-' . $term->taxonomy] === true ) ? 'noindex' : 'index';
		$noindex_options = array(
			'default' => sprintf( __( 'Use %s default (Currently: %s)', 'wordpress-seo' ), $term->taxonomy, $current ),
			'index'   => __( 'Always index', 'wordpress-seo' ),
			'noindex' => __( 'Always noindex', 'wordpress-seo' ) );
		$this->form_row( 'wpseo_noindex', sprintf( __( 'Noindex this %s', 'wordpress-seo' ), $term->taxonomy ), sprintf( __( 'This %s follows the indexation rules set under Metas and Titles, you can override it here.', 'wordpress-seo' ), $term->taxonomy ), $tax_meta, 'select', $noindex_options );

		$this->form_row( 'wpseo_sitemap_include', __( 'Include in sitemap?', 'wordpress-seo' ), '', $tax_meta, 'select', array(
			"-"      => __( "Auto detect", 'wordpress-seo' ),
			"always" => __( "Always include", 'wordpress-seo' ),
			"never"  => __( "Never include", 'wordpress-seo' ),
		) );

		echo '</table>';
	}

	/**
	 * Update the taxonomy meta data on save.
	 *
	 * @param int    $term_id  ID of the term to save data for
	 * @param int    $tt_id    The taxonomy_term_id for the term.
	 * @param string $taxonomy The taxonmy the term belongs to.
	 */
	function update_term( $term_id, $tt_id, $taxonomy ) {
		$tax_meta = get_option( 'wpseo_taxonomy_meta' );

		if ( !isset($tax_meta[$taxonomy]) || !isset($tax_meta[$taxonomy][$term_id]) || !is_array( $tax_meta[$taxonomy][$term_id] ) )
			$tax_meta[$taxonomy][$term_id] = array();

		foreach ( array( 'title', 'desc', 'metakey', 'bctitle', 'canonical', 'noindex', 'sitemap_include' ) as $key ) {
			if ( isset( $_POST['wpseo_' . $key] ) && !empty( $_POST['wpseo_' . $key] ) ) {
				$val = trim( $_POST['wpseo_' . $key] );

				if ( $key == 'canonical' )
					$val = esc_url( $val );
				else
					$val = sanitize_text_field( $val );

				$tax_meta[$taxonomy][$term_id]['wpseo_' . $key] = $val;
			} else {
				if ( isset( $tax_meta[$taxonomy][$term_id]['wpseo_' . $key] ) )
					unset( $tax_meta[$taxonomy][$term_id]['wpseo_' . $key] );
			}
		}

		update_option( 'wpseo_taxonomy_meta', $tax_meta, 99 );

		if ( defined( 'W3TC_DIR' ) && class_exists( 'W3_ObjectCache' ) ) {
			require_once W3TC_DIR . '/lib/W3/ObjectCache.php';
			$w3_objectcache = & W3_ObjectCache::instance();

			$w3_objectcache->flush();
		}
	}

	/**
	 * Allows HTML in descriptions
	 */
	function custom_category_descriptions_allow_html() {
		$filters = array(
			'pre_term_description',
			'pre_link_description',
			'pre_link_notes',
			'pre_user_description'
		);

		foreach ( $filters as $filter ) {
			remove_filter( $filter, 'wp_filter_kses' );
		}
		remove_filter( 'term_description', 'wp_kses_data' );
	}

	/**
	 * Adds shortcode support to category descriptions.
	 *
	 * @param string $desc String to add shortcodes in.
	 * @return string
	 */
	function custom_category_descriptions_add_shortcode_support( $desc ) {
		// Wrap in output buffering to prevent shortcodes that echo stuff instead of return from breaking things.
		ob_start();
		$desc = do_shortcode( $desc );
		ob_end_clean();

		return $desc;
	}
}

$wpseo_taxonomy = new WPSEO_Taxonomy();
