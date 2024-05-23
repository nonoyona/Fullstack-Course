import { useEffect } from "react";
import auth from "./services/auth";

const Authentication = ({ user, setUser, notify }) => {
	const handleLogin = async ({ username, password }) => {
		const user = await auth.login({ username, password });
        if (!user) {
            notify("Invalid username or password", "error");
            return;
        }
		window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
		setUser(user);
        notify(`Logged in as ${user.name}`);
	};

	const handleLogout = () => {
		auth.logout();
		setUser(null);
        notify("Logged out");
	};

	useEffect(() => {
		const user = auth.loadFromLocalStorage();
		if (user) {
			setUser(user);
		}
	}, []);

	return user ? (
		<div style={{ paddingBottom: 10 }}>
			Logged in as {user.name} <button onClick={handleLogout}>Log out</button>
		</div>
	) : (
		<LoginForm handleLogin={handleLogin} />
	);
};

const LoginForm = ({ handleLogin }) => {
	const onSubmit = (event) => {
		event.preventDefault();
		handleLogin({
			username: event.target.username.value,
			password: event.target.password.value,
		});
	};
	return (
		<form onSubmit={onSubmit}>
			<div>
				username
				<input id="username" />
			</div>
			<div>
				password
				<input id="password" />
			</div>
			<button type="submit">login</button>
		</form>
	);
};

export default Authentication;
