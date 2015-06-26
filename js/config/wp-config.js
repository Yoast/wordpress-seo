var args = {
    source: YoastSEO_WordPressScraper,
    analyzer: true,
    snippetPreview: true,
    elementTarget: ["content"],
    typeDelay: 300,
    typeDelayStep: 100,
    maxTypeDelay: 1500,
    dynamicDelay: true,
    multiKeyword: false,
    targets: {
        output: "wpseo-pageanalysis",
        overall: "wpseo-score",
        snippet: "wpseosnippet"
    },
    sampleText: {
        url: "http://example.com/example-post/",
        title: "This is an example title - edit by clicking here",
        keyword: "Choose a focus keyword",
        meta: "Modify your meta description by editing it right here",
        text: "Start writing your text!"
    }
};