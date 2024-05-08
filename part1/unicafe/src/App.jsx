import { useState } from "react";

const Button = ({ handleClick, text }) => (
	<button onClick={handleClick}>{text}</button>
);

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const total = good + neutral + bad;
	const average = (good - bad) / total;

	return (
		<div>
			<h1>give feedback</h1>
			<Button handleClick={() => setGood(good + 1)} text="good" />
			<Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
			<Button handleClick={() => setBad(bad + 1)} text="bad" />
			<h1>statistics</h1>
			<div>good {good}</div>
			<div>neutral {neutral}</div>
			<div>bad {bad}</div>
      <div>all {total}</div>
			<div>average {average.toFixed(4)}</div>
      <div>positive {((good / total) * 100).toFixed(4)} %</div>
		</div>
	);
};

export default App;
