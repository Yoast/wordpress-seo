<?php
/*
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */


  /**
   * The "cse" collection of methods.
   * Typical usage is:
   *  <code>
   *   $customsearchService = new Google_CustomsearchService(...);
   *   $cse = $customsearchService->cse;
   *  </code>
   */
  class Google_CseServiceResource extends Google_ServiceResource {

    /**
     * Returns metadata about the search performed, metadata about the custom search engine used for the
     * search, and the search results. (cse.list)
     *
     * @param string $q Query
     * @param array $optParams Optional parameters.
     *
     * @opt_param string c2coff Turns off the translation between zh-CN and zh-TW.
     * @opt_param string cr Country restrict(s).
     * @opt_param string cref The URL of a linked custom search engine
     * @opt_param string cx The custom search engine ID to scope this search query
     * @opt_param string dateRestrict Specifies all search results are from a time period
     * @opt_param string exactTerms Identifies a phrase that all documents in the search results must contain
     * @opt_param string excludeTerms Identifies a word or phrase that should not appear in any documents in the search results
     * @opt_param string fileType Returns images of a specified type. Some of the allowed values are: bmp, gif, png, jpg, svg, pdf, ...
     * @opt_param string filter Controls turning on or off the duplicate content filter.
     * @opt_param string gl Geolocation of end user.
     * @opt_param string googlehost The local Google domain to use to perform the search.
     * @opt_param string highRange Creates a range in form as_nlo value..as_nhi value and attempts to append it to query
     * @opt_param string hl Sets the user interface language.
     * @opt_param string hq Appends the extra query terms to the query.
     * @opt_param string imgColorType Returns black and white, grayscale, or color images: mono, gray, and color.
     * @opt_param string imgDominantColor Returns images of a specific dominant color: yellow, green, teal, blue, purple, pink, white, gray, black and brown.
     * @opt_param string imgSize Returns images of a specified size, where size can be one of: icon, small, medium, large, xlarge, xxlarge, and huge.
     * @opt_param string imgType Returns images of a type, which can be one of: clipart, face, lineart, news, and photo.
     * @opt_param string linkSite Specifies that all search results should contain a link to a particular URL
     * @opt_param string lowRange Creates a range in form as_nlo value..as_nhi value and attempts to append it to query
     * @opt_param string lr The language restriction for the search results
     * @opt_param string num Number of search results to return
     * @opt_param string orTerms Provides additional search terms to check for in a document, where each document in the search results must contain at least one of the additional search terms
     * @opt_param string relatedSite Specifies that all search results should be pages that are related to the specified URL
     * @opt_param string rights Filters based on licensing. Supported values include: cc_publicdomain, cc_attribute, cc_sharealike, cc_noncommercial, cc_nonderived and combinations of these.
     * @opt_param string safe Search safety level
     * @opt_param string searchType Specifies the search type: image.
     * @opt_param string siteSearch Specifies all search results should be pages from a given site
     * @opt_param string siteSearchFilter Controls whether to include or exclude results from the site named in the as_sitesearch parameter
     * @opt_param string sort The sort expression to apply to the results
     * @opt_param string start The index of the first result to return
     * @return Google_Search
     */
    public function listCse($q, $optParams = array()) {
      $params = array('q' => $q);
      $params = array_merge($params, $optParams);
      $data = $this->__call('list', array($params));
      if ($this->useObjects()) {
        return new Google_Search($data);
      } else {
        return $data;
      }
    }
  }

/**
 * Service definition for Google_Customsearch (v1).
 *
 * <p>
 * Lets you search over a website or collection of websites
 * </p>
 *
 * <p>
 * For more information about this service, see the
 * <a href="https://developers.google.com/custom-search/v1/using_rest" target="_blank">API Documentation</a>
 * </p>
 *
 * @author Google, Inc.
 */
class Google_CustomsearchService extends Google_Service {
  public $cse;
  /**
   * Constructs the internal representation of the Customsearch service.
   *
   * @param Google_Client $client
   */
  public function __construct(Google_Client $client) {
    $this->servicePath = 'customsearch/';
    $this->version = 'v1';
    $this->serviceName = 'customsearch';

    $client->addService($this->serviceName, $this->version);
    $this->cse = new Google_CseServiceResource($this, $this->serviceName, 'cse', json_decode('{"methods": {"list": {"id": "search.cse.list", "path": "v1", "httpMethod": "GET", "parameters": {"c2coff": {"type": "string", "location": "query"}, "cr": {"type": "string", "location": "query"}, "cref": {"type": "string", "location": "query"}, "cx": {"type": "string", "location": "query"}, "dateRestrict": {"type": "string", "location": "query"}, "exactTerms": {"type": "string", "location": "query"}, "excludeTerms": {"type": "string", "location": "query"}, "fileType": {"type": "string", "location": "query"}, "filter": {"type": "string", "enum": ["0", "1"], "location": "query"}, "gl": {"type": "string", "location": "query"}, "googlehost": {"type": "string", "location": "query"}, "highRange": {"type": "string", "location": "query"}, "hl": {"type": "string", "location": "query"}, "hq": {"type": "string", "location": "query"}, "imgColorType": {"type": "string", "enum": ["color", "gray", "mono"], "location": "query"}, "imgDominantColor": {"type": "string", "enum": ["black", "blue", "brown", "gray", "green", "pink", "purple", "teal", "white", "yellow"], "location": "query"}, "imgSize": {"type": "string", "enum": ["huge", "icon", "large", "medium", "small", "xlarge", "xxlarge"], "location": "query"}, "imgType": {"type": "string", "enum": ["clipart", "face", "lineart", "news", "photo"], "location": "query"}, "linkSite": {"type": "string", "location": "query"}, "lowRange": {"type": "string", "location": "query"}, "lr": {"type": "string", "enum": ["lang_ar", "lang_bg", "lang_ca", "lang_cs", "lang_da", "lang_de", "lang_el", "lang_en", "lang_es", "lang_et", "lang_fi", "lang_fr", "lang_hr", "lang_hu", "lang_id", "lang_is", "lang_it", "lang_iw", "lang_ja", "lang_ko", "lang_lt", "lang_lv", "lang_nl", "lang_no", "lang_pl", "lang_pt", "lang_ro", "lang_ru", "lang_sk", "lang_sl", "lang_sr", "lang_sv", "lang_tr", "lang_zh-CN", "lang_zh-TW"], "location": "query"}, "num": {"type": "integer", "default": "10", "format": "uint32", "location": "query"}, "orTerms": {"type": "string", "location": "query"}, "q": {"type": "string", "required": true, "location": "query"}, "relatedSite": {"type": "string", "location": "query"}, "rights": {"type": "string", "location": "query"}, "safe": {"type": "string", "default": "off", "enum": ["high", "medium", "off"], "location": "query"}, "searchType": {"type": "string", "enum": ["image"], "location": "query"}, "siteSearch": {"type": "string", "location": "query"}, "siteSearchFilter": {"type": "string", "enum": ["e", "i"], "location": "query"}, "sort": {"type": "string", "location": "query"}, "start": {"type": "integer", "format": "uint32", "location": "query"}}, "response": {"$ref": "Search"}}}}', true));

  }
}



class Google_Context extends Google_Model {
  protected $__facetsType = 'Google_ContextFacets';
  protected $__facetsDataType = 'array';
  public $facets;
  public $title;
  public function setFacets(/* array(Google_ContextFacets) */ $facets) {
    $this->assertIsArray($facets, 'Google_ContextFacets', __METHOD__);
    $this->facets = $facets;
  }
  public function getFacets() {
    return $this->facets;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
}

class Google_ContextFacets extends Google_Model {
  public $anchor;
  public $label;
  public function setAnchor( $anchor) {
    $this->anchor = $anchor;
  }
  public function getAnchor() {
    return $this->anchor;
  }
  public function setLabel( $label) {
    $this->label = $label;
  }
  public function getLabel() {
    return $this->label;
  }
}

class Google_Promotion extends Google_Model {
  protected $__bodyLinesType = 'Google_PromotionBodyLines';
  protected $__bodyLinesDataType = 'array';
  public $bodyLines;
  public $displayLink;
  public $htmlTitle;
  protected $__imageType = 'Google_PromotionImage';
  protected $__imageDataType = '';
  public $image;
  public $link;
  public $title;
  public function setBodyLines(/* array(Google_PromotionBodyLines) */ $bodyLines) {
    $this->assertIsArray($bodyLines, 'Google_PromotionBodyLines', __METHOD__);
    $this->bodyLines = $bodyLines;
  }
  public function getBodyLines() {
    return $this->bodyLines;
  }
  public function setDisplayLink( $displayLink) {
    $this->displayLink = $displayLink;
  }
  public function getDisplayLink() {
    return $this->displayLink;
  }
  public function setHtmlTitle( $htmlTitle) {
    $this->htmlTitle = $htmlTitle;
  }
  public function getHtmlTitle() {
    return $this->htmlTitle;
  }
  public function setImage(Google_PromotionImage $image) {
    $this->image = $image;
  }
  public function getImage() {
    return $this->image;
  }
  public function setLink( $link) {
    $this->link = $link;
  }
  public function getLink() {
    return $this->link;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
}

class Google_PromotionBodyLines extends Google_Model {
  public $htmlTitle;
  public $link;
  public $title;
  public $url;
  public function setHtmlTitle( $htmlTitle) {
    $this->htmlTitle = $htmlTitle;
  }
  public function getHtmlTitle() {
    return $this->htmlTitle;
  }
  public function setLink( $link) {
    $this->link = $link;
  }
  public function getLink() {
    return $this->link;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
  public function setUrl( $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_PromotionImage extends Google_Model {
  public $height;
  public $source;
  public $width;
  public function setHeight( $height) {
    $this->height = $height;
  }
  public function getHeight() {
    return $this->height;
  }
  public function setSource( $source) {
    $this->source = $source;
  }
  public function getSource() {
    return $this->source;
  }
  public function setWidth( $width) {
    $this->width = $width;
  }
  public function getWidth() {
    return $this->width;
  }
}

class Google_Query extends Google_Model {
  public $count;
  public $cr;
  public $cref;
  public $cx;
  public $dateRestrict;
  public $disableCnTwTranslation;
  public $exactTerms;
  public $excludeTerms;
  public $fileType;
  public $filter;
  public $gl;
  public $googleHost;
  public $highRange;
  public $hl;
  public $hq;
  public $imgColorType;
  public $imgDominantColor;
  public $imgSize;
  public $imgType;
  public $inputEncoding;
  public $language;
  public $linkSite;
  public $lowRange;
  public $orTerms;
  public $outputEncoding;
  public $relatedSite;
  public $rights;
  public $safe;
  public $searchTerms;
  public $searchType;
  public $siteSearch;
  public $siteSearchFilter;
  public $sort;
  public $startIndex;
  public $startPage;
  public $title;
  public $totalResults;
  public function setCount( $count) {
    $this->count = $count;
  }
  public function getCount() {
    return $this->count;
  }
  public function setCr( $cr) {
    $this->cr = $cr;
  }
  public function getCr() {
    return $this->cr;
  }
  public function setCref( $cref) {
    $this->cref = $cref;
  }
  public function getCref() {
    return $this->cref;
  }
  public function setCx( $cx) {
    $this->cx = $cx;
  }
  public function getCx() {
    return $this->cx;
  }
  public function setDateRestrict( $dateRestrict) {
    $this->dateRestrict = $dateRestrict;
  }
  public function getDateRestrict() {
    return $this->dateRestrict;
  }
  public function setDisableCnTwTranslation( $disableCnTwTranslation) {
    $this->disableCnTwTranslation = $disableCnTwTranslation;
  }
  public function getDisableCnTwTranslation() {
    return $this->disableCnTwTranslation;
  }
  public function setExactTerms( $exactTerms) {
    $this->exactTerms = $exactTerms;
  }
  public function getExactTerms() {
    return $this->exactTerms;
  }
  public function setExcludeTerms( $excludeTerms) {
    $this->excludeTerms = $excludeTerms;
  }
  public function getExcludeTerms() {
    return $this->excludeTerms;
  }
  public function setFileType( $fileType) {
    $this->fileType = $fileType;
  }
  public function getFileType() {
    return $this->fileType;
  }
  public function setFilter( $filter) {
    $this->filter = $filter;
  }
  public function getFilter() {
    return $this->filter;
  }
  public function setGl( $gl) {
    $this->gl = $gl;
  }
  public function getGl() {
    return $this->gl;
  }
  public function setGoogleHost( $googleHost) {
    $this->googleHost = $googleHost;
  }
  public function getGoogleHost() {
    return $this->googleHost;
  }
  public function setHighRange( $highRange) {
    $this->highRange = $highRange;
  }
  public function getHighRange() {
    return $this->highRange;
  }
  public function setHl( $hl) {
    $this->hl = $hl;
  }
  public function getHl() {
    return $this->hl;
  }
  public function setHq( $hq) {
    $this->hq = $hq;
  }
  public function getHq() {
    return $this->hq;
  }
  public function setImgColorType( $imgColorType) {
    $this->imgColorType = $imgColorType;
  }
  public function getImgColorType() {
    return $this->imgColorType;
  }
  public function setImgDominantColor( $imgDominantColor) {
    $this->imgDominantColor = $imgDominantColor;
  }
  public function getImgDominantColor() {
    return $this->imgDominantColor;
  }
  public function setImgSize( $imgSize) {
    $this->imgSize = $imgSize;
  }
  public function getImgSize() {
    return $this->imgSize;
  }
  public function setImgType( $imgType) {
    $this->imgType = $imgType;
  }
  public function getImgType() {
    return $this->imgType;
  }
  public function setInputEncoding( $inputEncoding) {
    $this->inputEncoding = $inputEncoding;
  }
  public function getInputEncoding() {
    return $this->inputEncoding;
  }
  public function setLanguage( $language) {
    $this->language = $language;
  }
  public function getLanguage() {
    return $this->language;
  }
  public function setLinkSite( $linkSite) {
    $this->linkSite = $linkSite;
  }
  public function getLinkSite() {
    return $this->linkSite;
  }
  public function setLowRange( $lowRange) {
    $this->lowRange = $lowRange;
  }
  public function getLowRange() {
    return $this->lowRange;
  }
  public function setOrTerms( $orTerms) {
    $this->orTerms = $orTerms;
  }
  public function getOrTerms() {
    return $this->orTerms;
  }
  public function setOutputEncoding( $outputEncoding) {
    $this->outputEncoding = $outputEncoding;
  }
  public function getOutputEncoding() {
    return $this->outputEncoding;
  }
  public function setRelatedSite( $relatedSite) {
    $this->relatedSite = $relatedSite;
  }
  public function getRelatedSite() {
    return $this->relatedSite;
  }
  public function setRights( $rights) {
    $this->rights = $rights;
  }
  public function getRights() {
    return $this->rights;
  }
  public function setSafe( $safe) {
    $this->safe = $safe;
  }
  public function getSafe() {
    return $this->safe;
  }
  public function setSearchTerms( $searchTerms) {
    $this->searchTerms = $searchTerms;
  }
  public function getSearchTerms() {
    return $this->searchTerms;
  }
  public function setSearchType( $searchType) {
    $this->searchType = $searchType;
  }
  public function getSearchType() {
    return $this->searchType;
  }
  public function setSiteSearch( $siteSearch) {
    $this->siteSearch = $siteSearch;
  }
  public function getSiteSearch() {
    return $this->siteSearch;
  }
  public function setSiteSearchFilter( $siteSearchFilter) {
    $this->siteSearchFilter = $siteSearchFilter;
  }
  public function getSiteSearchFilter() {
    return $this->siteSearchFilter;
  }
  public function setSort( $sort) {
    $this->sort = $sort;
  }
  public function getSort() {
    return $this->sort;
  }
  public function setStartIndex( $startIndex) {
    $this->startIndex = $startIndex;
  }
  public function getStartIndex() {
    return $this->startIndex;
  }
  public function setStartPage( $startPage) {
    $this->startPage = $startPage;
  }
  public function getStartPage() {
    return $this->startPage;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
  public function setTotalResults( $totalResults) {
    $this->totalResults = $totalResults;
  }
  public function getTotalResults() {
    return $this->totalResults;
  }
}

class Google_Result extends Google_Model {
  public $cacheId;
  public $displayLink;
  public $fileFormat;
  public $formattedUrl;
  public $htmlFormattedUrl;
  public $htmlSnippet;
  public $htmlTitle;
  protected $__imageType = 'Google_ResultImage';
  protected $__imageDataType = '';
  public $image;
  public $kind;
  protected $__labelsType = 'Google_ResultLabels';
  protected $__labelsDataType = 'array';
  public $labels;
  public $link;
  public $mime;
  public $pagemap;
  public $snippet;
  public $title;
  public function setCacheId( $cacheId) {
    $this->cacheId = $cacheId;
  }
  public function getCacheId() {
    return $this->cacheId;
  }
  public function setDisplayLink( $displayLink) {
    $this->displayLink = $displayLink;
  }
  public function getDisplayLink() {
    return $this->displayLink;
  }
  public function setFileFormat( $fileFormat) {
    $this->fileFormat = $fileFormat;
  }
  public function getFileFormat() {
    return $this->fileFormat;
  }
  public function setFormattedUrl( $formattedUrl) {
    $this->formattedUrl = $formattedUrl;
  }
  public function getFormattedUrl() {
    return $this->formattedUrl;
  }
  public function setHtmlFormattedUrl( $htmlFormattedUrl) {
    $this->htmlFormattedUrl = $htmlFormattedUrl;
  }
  public function getHtmlFormattedUrl() {
    return $this->htmlFormattedUrl;
  }
  public function setHtmlSnippet( $htmlSnippet) {
    $this->htmlSnippet = $htmlSnippet;
  }
  public function getHtmlSnippet() {
    return $this->htmlSnippet;
  }
  public function setHtmlTitle( $htmlTitle) {
    $this->htmlTitle = $htmlTitle;
  }
  public function getHtmlTitle() {
    return $this->htmlTitle;
  }
  public function setImage(Google_ResultImage $image) {
    $this->image = $image;
  }
  public function getImage() {
    return $this->image;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setLabels(/* array(Google_ResultLabels) */ $labels) {
    $this->assertIsArray($labels, 'Google_ResultLabels', __METHOD__);
    $this->labels = $labels;
  }
  public function getLabels() {
    return $this->labels;
  }
  public function setLink( $link) {
    $this->link = $link;
  }
  public function getLink() {
    return $this->link;
  }
  public function setMime( $mime) {
    $this->mime = $mime;
  }
  public function getMime() {
    return $this->mime;
  }
  public function setPagemap( $pagemap) {
    $this->pagemap = $pagemap;
  }
  public function getPagemap() {
    return $this->pagemap;
  }
  public function setSnippet( $snippet) {
    $this->snippet = $snippet;
  }
  public function getSnippet() {
    return $this->snippet;
  }
  public function setTitle( $title) {
    $this->title = $title;
  }
  public function getTitle() {
    return $this->title;
  }
}

class Google_ResultImage extends Google_Model {
  public $byteSize;
  public $contextLink;
  public $height;
  public $thumbnailHeight;
  public $thumbnailLink;
  public $thumbnailWidth;
  public $width;
  public function setByteSize( $byteSize) {
    $this->byteSize = $byteSize;
  }
  public function getByteSize() {
    return $this->byteSize;
  }
  public function setContextLink( $contextLink) {
    $this->contextLink = $contextLink;
  }
  public function getContextLink() {
    return $this->contextLink;
  }
  public function setHeight( $height) {
    $this->height = $height;
  }
  public function getHeight() {
    return $this->height;
  }
  public function setThumbnailHeight( $thumbnailHeight) {
    $this->thumbnailHeight = $thumbnailHeight;
  }
  public function getThumbnailHeight() {
    return $this->thumbnailHeight;
  }
  public function setThumbnailLink( $thumbnailLink) {
    $this->thumbnailLink = $thumbnailLink;
  }
  public function getThumbnailLink() {
    return $this->thumbnailLink;
  }
  public function setThumbnailWidth( $thumbnailWidth) {
    $this->thumbnailWidth = $thumbnailWidth;
  }
  public function getThumbnailWidth() {
    return $this->thumbnailWidth;
  }
  public function setWidth( $width) {
    $this->width = $width;
  }
  public function getWidth() {
    return $this->width;
  }
}

class Google_ResultLabels extends Google_Model {
  public $displayName;
  public $name;
  public function setDisplayName( $displayName) {
    $this->displayName = $displayName;
  }
  public function getDisplayName() {
    return $this->displayName;
  }
  public function setName( $name) {
    $this->name = $name;
  }
  public function getName() {
    return $this->name;
  }
}

class Google_Search extends Google_Model {
  protected $__contextType = 'Google_Context';
  protected $__contextDataType = '';
  public $context;
  protected $__itemsType = 'Google_Result';
  protected $__itemsDataType = 'array';
  public $items;
  public $kind;
  protected $__promotionsType = 'Google_Promotion';
  protected $__promotionsDataType = 'array';
  public $promotions;
  protected $__queriesType = 'Google_Query';
  protected $__queriesDataType = 'map';
  public $queries;
  protected $__searchInformationType = 'Google_SearchSearchInformation';
  protected $__searchInformationDataType = '';
  public $searchInformation;
  protected $__spellingType = 'Google_SearchSpelling';
  protected $__spellingDataType = '';
  public $spelling;
  protected $__urlType = 'Google_SearchUrl';
  protected $__urlDataType = '';
  public $url;
  public function setContext(Google_Context $context) {
    $this->context = $context;
  }
  public function getContext() {
    return $this->context;
  }
  public function setItems(/* array(Google_Result) */ $items) {
    $this->assertIsArray($items, 'Google_Result', __METHOD__);
    $this->items = $items;
  }
  public function getItems() {
    return $this->items;
  }
  public function setKind( $kind) {
    $this->kind = $kind;
  }
  public function getKind() {
    return $this->kind;
  }
  public function setPromotions(/* array(Google_Promotion) */ $promotions) {
    $this->assertIsArray($promotions, 'Google_Promotion', __METHOD__);
    $this->promotions = $promotions;
  }
  public function getPromotions() {
    return $this->promotions;
  }
  public function setQueries(Google_Query $queries) {
    $this->queries = $queries;
  }
  public function getQueries() {
    return $this->queries;
  }
  public function setSearchInformation(Google_SearchSearchInformation $searchInformation) {
    $this->searchInformation = $searchInformation;
  }
  public function getSearchInformation() {
    return $this->searchInformation;
  }
  public function setSpelling(Google_SearchSpelling $spelling) {
    $this->spelling = $spelling;
  }
  public function getSpelling() {
    return $this->spelling;
  }
  public function setUrl(Google_SearchUrl $url) {
    $this->url = $url;
  }
  public function getUrl() {
    return $this->url;
  }
}

class Google_SearchSearchInformation extends Google_Model {
  public $formattedSearchTime;
  public $formattedTotalResults;
  public $searchTime;
  public $totalResults;
  public function setFormattedSearchTime( $formattedSearchTime) {
    $this->formattedSearchTime = $formattedSearchTime;
  }
  public function getFormattedSearchTime() {
    return $this->formattedSearchTime;
  }
  public function setFormattedTotalResults( $formattedTotalResults) {
    $this->formattedTotalResults = $formattedTotalResults;
  }
  public function getFormattedTotalResults() {
    return $this->formattedTotalResults;
  }
  public function setSearchTime( $searchTime) {
    $this->searchTime = $searchTime;
  }
  public function getSearchTime() {
    return $this->searchTime;
  }
  public function setTotalResults( $totalResults) {
    $this->totalResults = $totalResults;
  }
  public function getTotalResults() {
    return $this->totalResults;
  }
}

class Google_SearchSpelling extends Google_Model {
  public $correctedQuery;
  public $htmlCorrectedQuery;
  public function setCorrectedQuery( $correctedQuery) {
    $this->correctedQuery = $correctedQuery;
  }
  public function getCorrectedQuery() {
    return $this->correctedQuery;
  }
  public function setHtmlCorrectedQuery( $htmlCorrectedQuery) {
    $this->htmlCorrectedQuery = $htmlCorrectedQuery;
  }
  public function getHtmlCorrectedQuery() {
    return $this->htmlCorrectedQuery;
  }
}

class Google_SearchUrl extends Google_Model {
  public $template;
  public $type;
  public function setTemplate( $template) {
    $this->template = $template;
  }
  public function getTemplate() {
    return $this->template;
  }
  public function setType( $type) {
    $this->type = $type;
  }
  public function getType() {
    return $this->type;
  }
}
