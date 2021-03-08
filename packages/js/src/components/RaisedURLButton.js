import PropTypes from "prop-types";
import RaisedDefaultButton from "./RaisedDefaultButton";
import InfoIcon from "material-ui/svg-icons/action/info";

/**
 * Raised Button with a default info icon and a required URL
 *
 * @param {Object} props The list of props for this element.
 * @returns {wp.Element} A RaisedDefaultButton element with supplied URL and Icon.
 * @constructor
 */
const RaisedURLButton = ( props ) => {
	return (
		<RaisedDefaultButton { ...props } />
	);
};

RaisedURLButton.propTypes = {
	url: PropTypes.string.isRequired,
	icon: PropTypes.object,
};

RaisedURLButton.defaultProps = {
	icon: <InfoIcon viewBox="0 0 28 28" />,
};

export default RaisedURLButton;
