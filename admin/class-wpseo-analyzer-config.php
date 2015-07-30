<?php

/**
 * @package WPSEO\Admin
 */
class WPSEO_Analyzer_Config
{

    /**
     * Return the javascript config for the analyzer
     */
    public function get_config()
    {
        // @todo Improve translators comment (This is taken directly from WordPress core)
        /* translators: This is a comma-separated list of very common words that should be excluded from a search,
		 * like a, an, and the. These are usually called "stopwords". You should not simply translate these individual
		 * words into your language. Instead, look for and provide commonly accepted stopwords in your language.
		 */
        $stop_words = __( 'a,about,above,after,again,against,all,am,an,and,any,are,as,at,be,because,been,before,being,below,between,both,but,by,could,did,do,does,doing,down,during,each,few,for,from,further,had,has,have,having,he,he\'d,he\'ll,he\'s,her,here,here\'s,hers,herself,him,himself,his,how,how\'s,i,i\'d,i\'ll,i\'m,i\'ve,if,in,into,is,it,it\'s,its,itself,let\'s,me,more,most,my,myself,nor,of,on,once,only,or,other,ought,our,ours,ourselves,out,over,own,same,she,she\'d,she\'ll,she\'s,should,so,some,such,than,that,that\'s,the,their,theirs,them,themselves,then,there,there\'s,these,they,they\'d,they\'ll,they\'re,they\'ve,this,those,through,to,too,under,until,up,very,was,we,we\'d,we\'ll,we\'re,we\'ve,were,what,what\'s,when,when\'s,where,where\'s,which,while,who,who\'s,whom,why,why\'s,with,would,you,you\'d,you\'ll,you\'re,you\'ve,your,yours,yourself,yourselves', 'wordpress-seo' );
        $stop_words = explode( ',', $stop_words );

        // @todo Add translator comment
        $words_to_remove = __( 'a,in,an,on,for,the,and', 'wordpress-seo' );
        $words_to_remove = explode( ',', $words_to_remove );

        // @todo Make PHP 5.2 ready:
        $words_to_remove = array_map( function( $word ) {
            return ' ' . trim( $word );
        }, $words_to_remove);

        return array(
            'analyzerConfig' => array(
                'queue' => array("wordCount","keywordDensity","subHeadings","stopwords","fleschReading","linkCount","imageCount","urlKeyword","urlLength","metaDescription","pageTitleKeyword","pageTitleLength","firstParagraph"),

                'stopWords' => $stop_words,
                'wordsToRemove' => $words_to_remove,

                'maxSlugLength' => 20,
                'maxUrlLength' => 40,
                'maxMeta' => 156,
            ),
            'preprocessorConfig' =>
                array(
                    'syllables' =>
                        array(
                            'subtractSyllables' =>
                                array(
                                    0 => 'cial',
                                    1 => 'tia',
                                    2 => 'cius',
                                    3 => 'cious',
                                    4 => 'giu',
                                    5 => 'ion',
                                    6 => 'iou',
                                    7 => 'sia$',
                                    8 => '[^aeiuoyt]{2,}ed$',
                                    9 => '[aeiouy][^aeiuoyts]{1,}e',
                                    10 => '.ely$',
                                    11 => '[cg]h?e[sd]',
                                    12 => 'rved$',
                                    13 => 'rved',
                                    14 => '[aeiouy][dt]es?$',
                                    15 => '[aeiouy][^aeiouydt]e[sd]?$',
                                    16 => '^[dr]e[aeiou][^aeiou]+$',
                                    17 => '[aeiouy]rse$',
                                ),
                            'addSyllables' =>
                                array(
                                    0 => 'ia',
                                    1 => 'riet',
                                    2 => 'dien',
                                    3 => 'iu',
                                    4 => 'io',
                                    5 => 'ii',
                                    6 => '[aeiouym][bdp]l',
                                    7 => '[aeiou]{3}',
                                    8 => '^mc',
                                    9 => 'ism$',
                                    10 => '([^aeiouy])l$',
                                    11 => '[^l]lien',
                                    12 => '^coa[dglx].',
                                    13 => '[^gq]ua[^auieo]',
                                    14 => 'dnt$',
                                    15 => 'uity$',
                                    16 => 'ie(r|st)',
                                    17 => '[aeiouy]ing',
                                    18 => '[aeiouw]y[aeiou]',
                                ),
                            'exclusionWords' =>
                                array(
                                    0 =>
                                        array(
                                            'word' => 'shoreline',
                                            'syllables' => 2,
                                        ),
                                    1 =>
                                        array(
                                            'word' => 'simile',
                                            'syllables' => 3,
                                        ),
                                ),
                        ),
                    'diacriticsRemovalMap' =>
                        array(
                            0 =>
                                array(
                                    'base' => 'a',
                                    'letters' =>
                                        array(),
                                ),
                            1 =>
                                array(
                                    'base' => 'aa',
                                    'letters' =>
                                        array(),
                                ),
                            2 =>
                                array(
                                    'base' => 'ae',
                                    'letters' =>
                                        array(),
                                ),
                            3 =>
                                array(
                                    'base' => 'ao',
                                    'letters' =>
                                        array(),
                                ),
                            4 =>
                                array(
                                    'base' => 'au',
                                    'letters' =>
                                        array(),
                                ),
                            5 =>
                                array(
                                    'base' => 'av',
                                    'letters' =>
                                        array(),
                                ),
                            6 =>
                                array(
                                    'base' => 'ay',
                                    'letters' =>
                                        array(),
                                ),
                            7 =>
                                array(
                                    'base' => 'b',
                                    'letters' =>
                                        array(),
                                ),
                            8 =>
                                array(
                                    'base' => 'c',
                                    'letters' =>
                                        array(),
                                ),
                            9 =>
                                array(
                                    'base' => 'd',
                                    'letters' =>
                                        array(),
                                ),
                            10 =>
                                array(
                                    'base' => 'dz',
                                    'letters' =>
                                        array(),
                                ),
                            11 =>
                                array(
                                    'base' => 'e',
                                    'letters' =>
                                        array(),
                                ),
                            12 =>
                                array(
                                    'base' => 'f',
                                    'letters' =>
                                        array(),
                                ),
                            13 =>
                                array(
                                    'base' => 'g',
                                    'letters' =>
                                        array(),
                                ),
                            14 =>
                                array(
                                    'base' => 'h',
                                    'letters' =>
                                        array(),
                                ),
                            15 =>
                                array(
                                    'base' => 'hv',
                                    'letters' =>
                                        array(),
                                ),
                            16 =>
                                array(
                                    'base' => 'i',
                                    'letters' =>
                                        array(),
                                ),
                            17 =>
                                array(
                                    'base' => 'j',
                                    'letters' =>
                                        array(),
                                ),
                            18 =>
                                array(
                                    'base' => 'k',
                                    'letters' =>
                                        array(),
                                ),
                            19 =>
                                array(
                                    'base' => 'l',
                                    'letters' =>
                                        array(),
                                ),
                            20 =>
                                array(
                                    'base' => 'lj',
                                    'letters' =>
                                        array(),
                                ),
                            21 =>
                                array(
                                    'base' => 'm',
                                    'letters' =>
                                        array(),
                                ),
                            22 =>
                                array(
                                    'base' => 'n',
                                    'letters' =>
                                        array(),
                                ),
                            23 =>
                                array(
                                    'base' => 'nj',
                                    'letters' =>
                                        array(),
                                ),
                            24 =>
                                array(
                                    'base' => 'o',
                                    'letters' =>
                                        array(),
                                ),
                            25 =>
                                array(
                                    'base' => 'oi',
                                    'letters' =>
                                        array(),
                                ),
                            26 =>
                                array(
                                    'base' => 'ou',
                                    'letters' =>
                                        array(),
                                ),
                            27 =>
                                array(
                                    'base' => 'oo',
                                    'letters' =>
                                        array(),
                                ),
                            28 =>
                                array(
                                    'base' => 'p',
                                    'letters' =>
                                        array(),
                                ),
                            29 =>
                                array(
                                    'base' => 'q',
                                    'letters' =>
                                        array(),
                                ),
                            30 =>
                                array(
                                    'base' => 'r',
                                    'letters' =>
                                        array(),
                                ),
                            31 =>
                                array(
                                    'base' => 's',
                                    'letters' =>
                                        array(),
                                ),
                            32 =>
                                array(
                                    'base' => 't',
                                    'letters' =>
                                        array(),
                                ),
                            33 =>
                                array(
                                    'base' => 'tz',
                                    'letters' =>
                                        array(),
                                ),
                            34 =>
                                array(
                                    'base' => 'u',
                                    'letters' =>
                                        array(),
                                ),
                            35 =>
                                array(
                                    'base' => 'v',
                                    'letters' =>
                                        array(),
                                ),
                            36 =>
                                array(
                                    'base' => 'vy',
                                    'letters' =>
                                        array(),
                                ),
                            37 =>
                                array(
                                    'base' => 'w',
                                    'letters' =>
                                        array(),
                                ),
                            38 =>
                                array(
                                    'base' => 'x',
                                    'letters' =>
                                        array(),
                                ),
                            39 =>
                                array(
                                    'base' => 'y',
                                    'letters' =>
                                        array(),
                                ),
                            40 =>
                                array(
                                    'base' => 'z',
                                    'letters' =>
                                        array(),
                                ),
                        ),
                ),
        );
    }

    /**
     * Return the javascript scoring config for the analyzer
     *
     * @return array
     */
    public function get_scoring()
    {
        return array(
            0 =>
                array(
                    'scoreName' => 'wordCount',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 300,
                                    'score' => 9,
                                    'text' => 'The text contains %1$d words, this is more than the %2$d word recommended minimum.',
                                ),
                            1 =>
                                array(
                                    'min' => 250,
                                    'max' => 299,
                                    'score' => 7,
                                    'text' => 'The text contains %1$d words, this is slightly below the %2$d word recommended minimum, add a bit more copy.',
                                ),
                            2 =>
                                array(
                                    'min' => 200,
                                    'max' => 249,
                                    'score' => 5,
                                    'text' => 'The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.',
                                ),
                            3 =>
                                array(
                                    'min' => 100,
                                    'max' => 199,
                                    'score' => -10,
                                    'text' => 'The text contains %1$d words, this is below the %2$d word recommended minimum. Add more useful content on this topic for readers.',
                                ),
                            4 =>
                                array(
                                    'min' => 0,
                                    'max' => 99,
                                    'score' => -20,
                                    'text' => 'The text contains %1$d words. This is far too low and should be increased.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'wordCount',
                                    'position' => '%1$d',
                                    'source' => 'matcher',
                                ),
                            1 =>
                                array(
                                    'name' => 'recommendedWordcount',
                                    'position' => '%2$d',
                                    'value' => 300,
                                ),
                        ),
                ),
            1 =>
                array(
                    'scoreName' => 'keywordDensity',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 3.5,
                                    'score' => -50,
                                    'text' => 'The keyword density is %1$f%, which is way over the advised 2.5% maximum, the focus keyword was found %1$d times.',
                                ),
                            1 =>
                                array(
                                    'min' => 2.5,
                                    'max' => 3.4900000000000002,
                                    'score' => -10,
                                    'text' => 'The keyword density is %1$f%, which is over the advised 2.5% maximum, the focus keyword was found %1$d times.',
                                ),
                            2 =>
                                array(
                                    'min' => 0.5,
                                    'max' => 2.4900000000000002,
                                    'score' => 9,
                                    'text' => 'The keyword density is %1$f%, which is great, the focus keyword was found %1$d times.',
                                ),
                            3 =>
                                array(
                                    'min' => 0,
                                    'max' => 0.48999999999999999,
                                    'score' => 4,

                                    'text' => __('The keyword density is %1$f%, which is a bit low, the focus keyword was found %1$d times.', 'wordpress-seo'),
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'keywordDensity',
                                    'position' => '%1$f',
                                    'source' => 'matcher',
                                ),
                            1 =>
                                array(
                                    'name' => 'keywordCount',
                                    'position' => '%1$d',
                                    'sourceObj' => '.refObj.__store.keywordCount',
                                ),
                        ),
                ),
            2 =>
                array(
                    'scoreName' => 'linkCount',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'total',
                                    'min' => 0,
                                    'max' => 0,
                                    'score' => 6,
                                    'text' => __('No outbound links appear in this page, consider adding some as appropriate.', 'wordpress-seo'),
                                ),
                            1 =>
                                array(
                                    'matcher' => 'totalKeyword',
                                    'min' => 1,
                                    'score' => 2,
                                    'text' => 'You\'re linking to another page with the focus keyword you want this page to rank for, consider changing that if you truly want this page to rank.',
                                ),
                            2 =>
                                array(
                                    'type' => 'externalAllNofollow',
                                    'score' => 7,
                                    'text' => 'This page has %2$s outbound link(s), all nofollowed.',
                                ),
                            3 =>
                                array(
                                    'type' => 'externalHasNofollow',
                                    'score' => 8,
                                    'text' => 'This page has %2$s nofollowed link(s) and %3$s normal outbound link(s).',
                                ),
                            4 =>
                                array(
                                    'type' => 'externalAllDofollow',
                                    'score' => 9,
                                    'text' => 'This page has %1$s outbound link(s).',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'links',
                                    'position' => '%1$s',
                                    'sourceObj' => '.result.externalTotal',
                                ),
                            1 =>
                                array(
                                    'name' => 'nofollow',
                                    'position' => '%2$s',
                                    'sourceObj' => '.result.externalNofollow',
                                ),
                            2 =>
                                array(
                                    'name' => 'dofollow',
                                    'position' => '%3$s',
                                    'sourceObj' => '.result.externalDofollow',
                                ),
                        ),
                ),
            3 =>
                array(
                    'scoreName' => 'fleschReading',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 90,
                                    'score' => 9,
                                    'text' => '<%text%>',
                                    'resultText' => 'very easy',
                                    'note' => '',
                                ),
                            1 =>
                                array(
                                    'min' => 80,
                                    'max' => 89.900000000000006,
                                    'score' => 9,
                                    'text' => '<%text%>',
                                    'resultText' => 'easy',
                                    'note' => '',
                                ),
                            2 =>
                                array(
                                    'min' => 70,
                                    'max' => 79.900000000000006,
                                    'score' => 8,
                                    'text' => '<%text%>',
                                    'resultText' => 'fairly easy',
                                    'note' => '',
                                ),
                            3 =>
                                array(
                                    'min' => 60,
                                    'max' => 69.900000000000006,
                                    'score' => 7,
                                    'text' => '<%text%>',
                                    'resultText' => 'ok',
                                    'note' => '',
                                ),
                            4 =>
                                array(
                                    'min' => 50,
                                    'max' => 59.899999999999999,
                                    'score' => 6,
                                    'text' => '<%text%>',
                                    'resultText' => 'fairly difficult',
                                    'note' => ' Try to make shorter sentences to improve readability.',
                                ),
                            5 =>
                                array(
                                    'min' => 30,
                                    'max' => 49.899999999999999,
                                    'score' => 5,
                                    'text' => '<%text%>',
                                    'resultText' => 'difficult',
                                    'note' => ' Try to make shorter sentences, using less difficult words to improve readability.',
                                ),
                            6 =>
                                array(
                                    'min' => 0,
                                    'max' => 29.899999999999999,
                                    'score' => 4,
                                    'text' => '<%text%>',
                                    'resultText' => 'very difficult',
                                    'note' => ' Try to make shorter sentences, using less difficult words to improve readability.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'scoreText',
                                    'position' => '<%text%>',
                                    'value' => 'The copy scores %1$s in the %2$s test, which is considered %3$s to read.%4$s',
                                ),
                            1 =>
                                array(
                                    'name' => 'text',
                                    'position' => '%1$s',
                                    'sourceObj' => '.result',
                                ),
                            2 =>
                                array(
                                    'name' => 'scoreUrl',
                                    'position' => '%2$s',
                                    'value' => '<a href=\'https://en.wikipedia.org/wiki/Flesch-Kincaid_readability_test#Flesch_Reading_Ease\' target=\'new\'>Flesch Reading Ease</a>',
                                ),
                            3 =>
                                array(
                                    'name' => 'resultText',
                                    'position' => '%3$s',
                                    'scoreObj' => 'resultText',
                                ),
                            4 =>
                                array(
                                    'name' => 'note',
                                    'position' => '%4$s',
                                    'scoreObj' => 'note',
                                ),
                        ),
                ),
            4 =>
                array(
                    'scoreName' => 'metaDescriptionLength',
                    'metaMinLength' => 120,
                    'metaMaxLength' => 156,
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'max' => 0,
                                    'score' => 1,
                                    'text' => 'No meta description has been specified, search engines will display copy from the page instead.',
                                ),
                            1 =>
                                array(
                                    'max' => 120,
                                    'score' => 6,
                                    'text' => 'The meta description is under %1$d characters, however up to %2$d characters are available.',
                                ),
                            2 =>
                                array(
                                    'min' => 156,
                                    'score' => 6,
                                    'text' => 'The specified meta description is over %2$d characters, reducing it will ensure the entire description is visible',
                                ),
                            3 =>
                                array(
                                    'min' => 120,
                                    'max' => 156,
                                    'score' => 9,
                                    'text' => 'In the specified meta description, consider: How does it compare to the competition? Could it be made more appealing?',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'minCharacters',
                                    'position' => '%1$d',
                                    'value' => 120,
                                ),
                            1 =>
                                array(
                                    'name' => 'maxCharacters',
                                    'position' => '%2$d',
                                    'value' => 156,
                                ),
                        ),
                ),
            5 =>
                array(
                    'scoreName' => 'metaDescriptionKeyword',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 1,
                                    'score' => 9,
                                    'text' => 'The meta description contains the focus keyword.',
                                ),
                            1 =>
                                array(
                                    'max' => 0,
                                    'score' => 3,
                                    'text' => 'A meta description has been specified, but it does not contain the focus keyword.',
                                ),
                        ),
                ),
            6 =>
                array(
                    'scoreName' => 'firstParagraph',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'max' => 0,
                                    'score' => 3,
                                    'text' => 'The focus keyword doesn\'t appear in the first paragraph of the copy, make sure the topic is clear immediately.',
                                ),
                            1 =>
                                array(
                                    'min' => 1,
                                    'score' => 9,
                                    'text' => 'The focus keyword appears in the first paragraph of the copy.',
                                ),
                        ),
                ),
            7 =>
                array(
                    'scoreName' => 'stopwordKeywordCount',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'count',
                                    'min' => 1,
                                    'score' => 5,
                                    'text' => 'The focus keyword for this page contains one or more %1$s, consider removing them. Found \'%2$s\'.',
                                ),
                            1 =>
                                array(
                                    'matcher' => 'count',
                                    'max' => 0,
                                    'score' => 0,
                                    'text' => '',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'scoreUrl',
                                    'position' => '%1$s',
                                    'value' => '<a href=\'https://en.wikipedia.org/wiki/Stop_words\' target=\'new\'>stop words</a>',
                                ),
                            1 =>
                                array(
                                    'name' => 'stopwords',
                                    'position' => '%2$s',
                                    'sourceObj' => '.result.matches',
                                ),
                        ),
                ),
            8 =>
                array(
                    'scoreName' => 'subHeadings',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'count',
                                    'max' => 0,
                                    'score' => 7,
                                    'text' => 'No subheading tags (like an H2) appear in the copy.',
                                ),
                            1 =>
                                array(
                                    'matcher' => 'matches',
                                    'max' => 0,
                                    'score' => 3,
                                    'text' => 'You have not used your focus keyword in any subheading (such as an H2) in your copy.',
                                ),
                            2 =>
                                array(
                                    'matcher' => 'matches',
                                    'min' => 1,
                                    'score' => 9,
                                    'text' => 'The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. While not a major ranking factor, this is beneficial.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'count',
                                    'position' => '%1$d',
                                    'sourceObj' => '.result.count',
                                ),
                            1 =>
                                array(
                                    'name' => 'matches',
                                    'position' => '%2$d',
                                    'sourceObj' => '.result.matches',
                                ),
                        ),
                ),
            9 =>
                array(
                    'scoreName' => 'pageTitleLength',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'max' => 0,
                                    'score' => 1,
                                    'text' => 'Please create a page title.',
                                ),
                            1 =>
                                array(
                                    'max' => 40,
                                    'score' => 6,
                                    'text' => 'The page title contains %3$d characters, which is less than the recommended minimum of %1$d characters. Use the space to add keyword variations or create compelling call-to-action copy.',
                                ),
                            2 =>
                                array(
                                    'min' => 70,
                                    'score' => 6,
                                    'text' => 'The page title contains %3$d characters, which is more than the viewable limit of %2$d characters; some words will not be visible to users in your listing.',
                                ),
                            3 =>
                                array(
                                    'min' => 40,
                                    'max' => 70,
                                    'score' => 9,
                                    'text' => 'The page title is more than %1$d characters and less than the recommended %2$d character limit.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'minLength',
                                    'position' => '%1$d',
                                    'value' => 40,
                                ),
                            1 =>
                                array(
                                    'name' => 'maxLength',
                                    'position' => '%2$d',
                                    'value' => 70,
                                ),
                            2 =>
                                array(
                                    'name' => 'length',
                                    'position' => '%3$d',
                                    'source' => 'matcher',
                                ),
                        ),
                ),
            10 =>
                array(
                    'scoreName' => 'pageTitleKeyword',
                    'scoreTitleKeywordLimit' => 0,
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'matches',
                                    'max' => 0,
                                    'score' => 2,
                                    'text' => 'The focus keyword \'%1$s\' does not appear in the page title.',
                                ),
                            1 =>
                                array(
                                    'matcher' => 'position',
                                    'max' => 1,
                                    'score' => 9,
                                    'text' => 'The page title contains the focus keyword, at the beginning which is considered to improve rankings.',
                                ),
                            2 =>
                                array(
                                    'matcher' => 'position',
                                    'min' => 1,
                                    'score' => 6,
                                    'text' => 'The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'keyword',
                                    'position' => '%1$s',
                                    'sourceObj' => '.refObj.config.keyword',
                                ),
                        ),
                ),
            11 =>
                array(
                    'scoreName' => 'urlKeyword',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 1,
                                    'score' => 9,
                                    'text' => 'The focus keyword appears in the URL for this page.',
                                ),
                            1 =>
                                array(
                                    'max' => 0,
                                    'score' => 6,
                                    'text' => 'The focus keyword does not appear in the URL for this page. If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!',
                                ),
                        ),
                ),
            12 =>
                array(
                    'scoreName' => 'urlLength',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'type' => 'urlTooLong',
                                    'score' => 5,
                                    'text' => 'The slug for this page is a bit long, consider shortening it.',
                                ),
                        ),
                ),
            13 =>
                array(
                    'scoreName' => 'urlStopwords',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'min' => 1,
                                    'score' => 5,
                                    'text' => 'The slug for this page contains one or more <a href=\'http://en.wikipedia.org/wiki/Stop_words\' target=\'new\'>stop words</a>, consider removing them.',
                                ),
                        ),
                ),
            14 =>
                array(
                    'scoreName' => 'imageCount',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'total',
                                    'max' => 0,
                                    'score' => 3,
                                    'text' => 'No images appear in this page, consider adding some as appropriate.',
                                ),
                            1 =>
                                array(
                                    'matcher' => 'noAlt',
                                    'min' => 1,
                                    'score' => 5,
                                    'text' => 'The images on this page are missing alt tags.',
                                ),
                            2 =>
                                array(
                                    'matcher' => 'alt',
                                    'min' => 1,
                                    'score' => 5,
                                    'text' => 'The images on this page do not have alt tags containing your focus keyword.',
                                ),
                            3 =>
                                array(
                                    'matcher' => 'altKeyword',
                                    'min' => 1,
                                    'score' => 9,
                                    'text' => 'The images on this page contain alt tags with the focus keyword.',
                                ),
                        ),
                ),
            15 =>
                array(
                    'scoreName' => 'keywordDoubles',
                    'scoreArray' =>
                        array(
                            0 =>
                                array(
                                    'matcher' => 'count',
                                    'max' => 0,
                                    'score' => 9,
                                    'text' => 'You\'ve never used this focus keyword before, very good.',
                                ),
                            1 =>
                                array(
                                    'matcher' => 'count',
                                    'max' => 1,
                                    'score' => 6,
                                    'text' => 'You\'ve used this focus keyword %1$sonce before%2$s, be sure to make very clear which URL on your site is the most important for this keyword.',
                                ),
                            2 =>
                                array(
                                    'matcher' => 'count',
                                    'min' => 1,
                                    'score' => 1,
                                    'text' => 'You\'ve used this focus keyword %3$s%4$d times before%2$s, it\'s probably a good idea to read %6$sthis post on cornerstone content%5$s and improve your keyword strategy.',
                                ),
                        ),
                    'replaceArray' =>
                        array(
                            0 =>
                                array(
                                    'name' => 'singleUrl',
                                    'position' => '%1$s',
                                    'sourceObj' => '.refObj.config.postUrl',
                                ),
                            1 =>
                                array(
                                    'name' => 'endTag',
                                    'position' => '%2$s',
                                    'value' => '</a>',
                                ),
                            2 =>
                                array(
                                    'name' => 'multiUrl',
                                    'position' => '%3$s',
                                    'sourceObj' => '.refObj.config.searchUrl',
                                ),
                            3 =>
                                array(
                                    'name' => 'occurrences',
                                    'position' => '%4$d',
                                    'sourceObj' => '.result.count',
                                ),
                            4 =>
                                array(
                                    'name' => 'endTag',
                                    'position' => '%5$s',
                                    'value' => '</a>',
                                ),
                            5 =>
                                array(
                                    'name' => 'cornerstone',
                                    'position' => '%6$s',
                                    'value' => '<a href=\'https://yoast.com/cornerstone-content-rank/\' target=\'new\'>',
                                ),
                            6 =>
                                array(
                                    'name' => 'id',
                                    'position' => '{id}',
                                    'sourceObj' => '.result.id',
                                ),
                            7 =>
                                array(
                                    'name' => 'keyword',
                                    'position' => '{keyword}',
                                    'sourceObj' => '.refObj.config.keyword',
                                ),
                        ),
                ),
        );
    }
}