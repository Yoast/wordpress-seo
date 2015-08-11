// https://github.com/rockykitamura/grunt-po2json
module.exports = {
    all: {
        options: {
            format: "jed1.x",
            domain: "js-text-analysis"
        },
        src: [ "languages/*.po" ],
        dest: "languages"
    }
};
