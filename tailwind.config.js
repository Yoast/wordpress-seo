module.exports = {
	content: [ "./packages/js/**/*.{html,js}" ],
	theme: {
		fontSize: {
			xxs: "0.6rem",
			xs: ".75rem",
			sm: ".8125rem",
			tiny: ".875rem",
			base: "1rem",
			lg: "1.125rem",
			xl: "1.25rem",
			"2xl": "1.5rem",
			"3xl": "1.875rem",
			"4xl": "2.25rem",
			"5xl": "3rem",
			"6xl": "4rem",
			"7xl": "5rem",
		},
		extend: {
			colors: {
				primary: {
					50: "#faf4f8",
					100: "#f6eaf0",
					200: "#e8c9da",
					300: "#dba9c3",
					400: "#bf6997",
					500: "#a4286a",
					600: "#94245f",
					700: "#7b1e50",
					800: "#621840",
					900: "#501434",
				},
			},
		},
	},
	variants: {
		extend: {
			backgroundColor: [ "active", "group-focus", "disabled" ],
			borderWidth: [ "first", "last" ],
			borderRadius: [ "first", "last" ],
			textColor: [ "active", "group-focus" ],
			margin: [ "last" ],
		},
	},
	plugins: [],
	important: true,
	prefix: "yst-",
};
