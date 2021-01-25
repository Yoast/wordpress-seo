import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Fragment } from "@wordpress/element";
import PrePublishScore from "./prepublish/PrePublishScore";
import { Button } from "@yoast/components";

/**
 * Renders the PrePublish Yoast integration.
 *
 * @returns {wp.Element} The PrePublish panel.
 */
export default function PrePublish( {
	scoreItems,
	onClick,
} ) {
	let intro;
	const perfectScore = scoreItems.every( item => item.score === "good" );

	if ( perfectScore ) {
		intro = <p>{ __( "We've analyzed your post. Everything looks good. Well done!", "wordpress-seo" ) }</p>;
	} else {
		intro = <p>{ __( "We've analyzed your post. There is still room for improvement!", "wordpress-seo" ) }</p>;
	}

	return <Fragment>
		{ intro }
		{ scoreItems.map( item => <PrePublishScore key={ item.label } { ...item } /> ) }
		<br />
		{ ! perfectScore && <Button onClick={ onClick }>{ __( "Improve your post with Yoast SEO", "wordpress-seo" ) }</Button> }
	</Fragment>;
}

PrePublish.propTypes = {
	scoreItems: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
};
