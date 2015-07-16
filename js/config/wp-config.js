var args = {
    //source to use as feeder for the analyzer and snippetPreview
    source: YoastSEO_WordPressScraper,
    //if it must run the anlayzer
    analyzer: true,
    //if it uses ajax to get data.
    ajax: true,
    //if it must generate snippetpreview
    snippetPreview: true,
    //element Target Array
    elementTarget: ["content","yoast_wpseo_focuskw","yoast_wpseo_metadesc","excerpt","editable-post-name","editable-post-name-full"],
    //replacement target array, elements that must trigger the replace variables function.
    replaceTarget: ["yoast_wpseo_metadesc", "excerpt","yoast_wpseo_title"],
    //rest target array, elements that must be reset on focus
    resetTarget: ["snippet_meta", "snippet_title","snippet_cite"],
    //typeDelay is used as the timeout between stopping with typing and triggering the analyzer
    typeDelay: 300,
    //Dynamic delay makes sure the delay is increased if the analyzer takes longer than the default, to prevent slow systems.
    typeDelayStep: 100,
    maxTypeDelay: 1500,
    dynamicDelay: true,
    //used for multiple keywords (future use)
    multiKeyword: false,
    //targets for the objects
    targets: {
        output: "wpseo-pageanalysis",
        overall: "wpseo-score",
        snippet: "wpseosnippet"
    },
    //sample texts for snippetPreview
    sampleText: {
        url: "http://example.com/example-post/",
        title: "This is an example title - edit by clicking here",
        keyword: "Choose a focus keyword",
        meta: "Modify your meta description by editing it right here",
        text: "Start writing your text!"
    }
};