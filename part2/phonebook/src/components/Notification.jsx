/* eslint-disable react/prop-types */
const InnerNotification = ({ message, level }) => {
	const style = {
		color: level === "error" ? "red" : "green",
		background: level === "error" ? "lightred" : "lightgreen",
		fontSize: 20,
		borderStyle: "solid",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};

	return <div style={style}>{message}</div>;
};

const Notification = ({ notification }) => {
	if (notification === null) {
		return <></>;
	}
	return (
		<InnerNotification message={notification.message} level={notification.level} />
	);
};

export default Notification;
