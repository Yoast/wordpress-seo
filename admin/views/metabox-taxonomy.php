<?php
/**
 * @package	admin\views
 */

$taxonomy_presenter = new WPSEO_Taxonomy_Presenter( $term );
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
				<?php if ( $taxonomy_presenter->show_social() ) { ?>
				<li class="social"><a class="wpseo_tablink" href="#wpseo_social">Social</a></li>
				<?php } ?>
			</ul>

			<div class="wpseotab general">
				<table class="form-table wpseo-taxonomy-form">
					<?php $taxonomy_presenter->display_fields( $taxonomy_presenter->general_fields() ); ?>
				</table>
			</div>


			<?php if ( $taxonomy_presenter->show_social() ) { ?>
			<div class="wpseotab social">
				<table class="form-table wpseo-taxonomy-form">
					<?php $taxonomy_presenter->display_fields( $taxonomy_presenter->social_fields() ); ?>
				</table>
			</div>
			<?php } ?>
		</div>
	</div>
</div>
