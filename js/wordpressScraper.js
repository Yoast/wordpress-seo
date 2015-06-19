YoastSEO_WordPressScraper = function() {
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
