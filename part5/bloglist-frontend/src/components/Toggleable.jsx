import { useState } from "react";
import PropTypes from "prop-types";

const Toggleable = ({ children, title, show }) => {
	const [innerShow, setShow] = useState(false);

	const toggle = () => {
		if (show !== undefined) {
			console.warn(
				"Toggleable: Cannot toggle when show is defined from outside scope."
			);
			return;
		}
		setShow(!innerShow);
	};

	const shouldShow = show !== undefined ? show : innerShow;
	if (!shouldShow) {
		return (
			<div>
				{show !== undefined ? null : <button onClick={toggle}>{title}</button>}
			</div>
		);
	} else {
		return (
			<>
				{children}
				{show !== undefined ? null : <button onClick={toggle}>Cancel</button>}
			</>
		);
	}
};

Toggleable.propTypes = {
	title: PropTypes.string.isRequired,
	show: PropTypes.bool,
	children: PropTypes.node.isRequired,
};

export default Toggleable;
