<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Manages stop words and filtering stop words from slugs
 */
class WPSEO_Admin_Stop_Words {
	/**
	 * Removes stop words in a slug
	 *
	 * @param string $original_slug The slug to remove stop words in.
	 *
	 * @return string
	 */
	public function remove_in( $original_slug ) {
		// Turn it to an array and strip stop words by comparing against an array of stopwords.
		$new_slug_parts = array_diff( explode( '-', $original_slug ), $this->list_stop_words() );

		// Don't change the slug if there are less than 3 words left.
		if ( count( $new_slug_parts ) < 3 ) {
			return $original_slug;
		}

		// Turn the sanitized array into a string.
		$new_slug = join( '-', $new_slug_parts );

		return $new_slug;
	}

	/**
	 * Returns a translated, filtered list of stop words
	 *
	 * @return array An array of stop words.
	 */
	public function list_stop_words() {
		/* translators: this should be an array of stop words for your language, separated by comma's. */
		$stopwords = explode( ',', __( "a,about,above,after,again,against,all,am,an,and,any,are,as,at,be,because,been,before,being,below,between,both,but,by,could,did,do,does,doing,down,during,each,few,for,from,further,had,has,have,having,he,he'd,he'll,he's,her,here,here's,hers,herself,him,himself,his,how,how's,i,i'd,i'll,i'm,i've,if,in,into,is,it,it's,its,itself,let's,me,more,most,my,myself,nor,of,on,once,only,or,other,ought,our,ours,ourselves,out,over,own,same,she,she'd,she'll,she's,should,so,some,such,than,that,that's,the,their,theirs,them,themselves,then,there,there's,these,they,they'd,they'll,they're,they've,this,those,through,to,too,under,until,up,very,was,we,we'd,we'll,we're,we've,were,what,what's,when,when's,where,where's,which,while,who,who's,whom,why,why's,with,would,you,you'd,you'll,you're,you've,your,yours,yourself,yourselves", 'wordpress-seo' ) );

		/**
		 * Allows filtering of the stop words list
		 * Especially useful for users on a language in which WPSEO is not available yet
		 * and/or users who want to turn off stop word filtering
		 * @api  array  $stopwords  Array of all lowercase stop words to check and/or remove from slug
		 */
		$stopwords = apply_filters( 'wpseo_stopwords', $stopwords );

		return $stopwords;
	}
}
