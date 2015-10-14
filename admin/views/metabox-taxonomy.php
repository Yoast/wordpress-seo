<?php
/**
 * @package	admin\views
 */

$taxonomy_presenter = new WPSEO_Taxonomy_Presenter( $term );

$general_tab = new WPSEO_Taxonomy_General_Tab( $term );
$social_tab  = new WPSEO_Taxonomy_Social_Tab( $term );
?>
<div id="poststuff" class="postbox">
	<h3>
		<span>
			<?php
				/* translators: %1$s expands to Yoast SEO */
				printf( __( '%1$s Settings', 'wordpress-seo' ), 'Yoast SEO' );
			?>
		</span>
	</h3>

	<div class="inside">
		<div class="wpseo-metabox-tabs-div">
			<ul class="wpseo-metabox-tabs" id="wpseo-metabox-tabs" style="display: block;">
				<li class="general"><a class="wpseo_tablink" href="#wpseo_general">General</a></li>
				<?php if ( $social_tab->show_social() ) { ?>
				<li class="social"><a class="wpseo_tablink" href="#wpseo_social">Social</a></li>
				<?php } ?>
			</ul>

			<div class="wpseotab general">
				<table class="form-table wpseo-taxonomy-form">
                    <div id="taxonomy_snippet" class="wpseosnippet"></div>
                    <div id="taxonomy_analyzer_output"></div>
                    <div id="taxonomy_overall"></div>
					<?php $taxonomy_presenter->display_fields( $general_tab->get_fields() ); ?>
				</table>
			</div>

			<?php if ( $social_tab->show_social() ) { ?>
			<div class="wpseotab social">
				<table class="form-table wpseo-taxonomy-form">
					<?php $taxonomy_presenter->display_fields( $social_tab->get_fields() ); ?>
				</table>
			</div>
			<?php } ?>
		</div>
	</div>
</div>
