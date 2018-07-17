import React from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import GutenbergToggle from "../Shared/components/GutenbergToggle";

// Add label.
const Cornerstone = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    label { 
        margin-right: 10px;
        flex-shrink: 0;
        max-width: 75%;
    }
`;

class CornerstoneToggle extends React.Component {
	render() {
		return (
			<Cornerstone>
				<label htmlFor={"CornerstoneToggleId"}>Cornerstone</label>
				<GutenbergToggle
					key="toggle"
					checked={this.props.checked}
					onChange={this.props.onChange}
					id={"CornerstoneToggleId"}
				/>
			</Cornerstone>
		)
	}
}

CornerstoneToggle.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

CornerstoneToggle.defaultProps = {
	checked: false,
};

export default CornerstoneToggle;
