import React from "react";

const Section = ( props ) => {
	const Heading = `h${props.level}`;

	return (
		<section className={props.className}>
			<Heading className={props.headingCSS}>{props.headingText}</Heading>
			{props.children}
		</section>
	)
};

Section.propTypes = {
	level: React.PropTypes.number.isRequired,
	headingText: React.PropTypes.string.isRequired,
};

Section.defaultProps = {
	level: 1,
	headingCSS: "",
};

export default Section;
