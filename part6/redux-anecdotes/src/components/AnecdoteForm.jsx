import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";

const AnecdoteForm = () => {
	const dispatch = useDispatch();
	const create = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		console.log("create", content);
		event.target.anecdote.value = "";
		dispatch(createAnecdote(content));
	};

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={create}>
				<div>
					<input name="anecdote" />
				</div>
				<button>create</button>
			</form>
		</>
	);
};

export default AnecdoteForm;
