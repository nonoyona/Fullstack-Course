import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const Notification = ({ notification, clearNotification }) => {
	const [notificationHandle, setNotificationHandle] = useState(null);
	useEffect(() => {
		if (notificationHandle) {
			clearTimeout(notificationHandle);
		}
		if (notification) {
			const handle = setTimeout(() => {
				clearNotification();
			}, 5000);
			setNotificationHandle(handle);
		}
	}, [notification]);

	const style = {
		border: "solid",
		padding: 10,
		borderWidth: 1,
	};

	if (notification === null) {
		return <div></div>;
	}

	if (notification.level === "error") {
		style.color = "red";
		style.backgroundColor = "lightgrey";
	} else {
		style.color = "green";
		style.backgroundColor = "lightgreen";
	}

	return <div style={style}>{notification.message}</div>;
};

Notification.propTypes = {
	notification: PropTypes.object,
	clearNotification: PropTypes.func.isRequired,
};

export default Notification;
