module.exports = {
	copy: {
			files: [ {
				expand: true,
				options: {
					noProcess:[ "**/*, png" ]
				},
				src:  "<%= paths.css %>*.png",
				dest: "dist/"
			} ]
	}
};
