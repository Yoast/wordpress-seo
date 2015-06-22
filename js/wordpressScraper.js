YoastSEO_WordPressScraper = function() {
    this.values = {};
};

YoastSEO_WordPressScraper.prototype.getContent = function() {
    this.values.keyword = this.getKeyword();
    this.values.meta = this.getMeta();
    this.values.textString = this.getText();
    this.values.title = this.getTitle();
    this.values.url = this.getUrl();
    return this.values;
};

YoastSEO_WordPressScraper.prototype.getKeyword = function() {
    return document.getElementById("yoast_wpseo_focuskw").value;
};

YoastSEO_WordPressScraper.prototype.getMeta = function() {
    return document.getElementById("yoast_wpseo_metadesc").value;
};

YoastSEO_WordPressScraper.prototype.getTitle = function() {
    return document.getElementById("yoast_wpseo_title").value;
};

YoastSEO_WordPressScraper.prototype.getUrl = function() {
    return document.getElementById("sample-permalink").innerText;
};

YoastSEO_WordPressScraper.prototype.getText = function() {
    var text = document.getElementById("content").value;
    if(typeof tinyMCE !== "undefined") {
        text =  tinyMCE.get("content").getContent();
    }
    return text;
};

YoastSEO_WordPressScraper.prototype.getInput = function( inputType ) {
    var val;
    switch( inputType){
        case "text":
            val = this.getContentTinyMCE();
            break;
        case "url":
            val = document.getElementById("sample-permalink").innerText;
            break;
        case "meta":
            val = document.getElementById("yoast_wpseo_metadesc").value;
            break;
        case "keyword":
            val = document.getElementById("yoast_wpseo_focuskw").value;
            break;
        case "title":
            val = document.getElementById("title").value;
            break;
        default:
            break;
    }
    return val;
};

YoastSEO_WordPressScraper.prototype.setInputData = function ( inputType, value) {
    switch( inputType ){
        case "title":
            document.getElementById( "title" ).value = document.getElementById( "snippet_title" ).innerText;
            break;
        case "meta":
            document.getElementById( "yoast_wpseo_metadesc" ).value = document.getElementById( "snippet_meta" ).innerText;
            break;
        case "url":
            document.getElementById("sample-permalink").innerText = document.getElementById( "snippet_cite" ).innerText;
            break;
        default:
            break;
    }
};

YoastSEO_WordPressScraper.prototype.getContentTinyMCE = function() {
    var val = document.getElementById( "content").value;
    if(tinyMCE.editors.length !== 0){
        val = tinyMCE.get( "content").getContent();
    }
    return val;
};