const Course = ({ course }) => {
	return (
		<div>
			<Header name={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};

const Header = ({ name }) => {
	return <h1>{name}</h1>;
};

const Total = ({ parts }) => {
	const total = parts.reduce((sum, part) => sum + part.exercises, 0);
	return (
		<p>
			<b>total of {total} exercises</b>
		</p>
	);
};

const Content = ({ parts }) => {
	console.log("Got parts:", parts.length);
	return (
		<div>
			{parts.map((part) => (
				<Part key={part.id} name={part.name} exercises={part.exercises} />
			))}
		</div>
	);
};

const Part = ({ name, exercises }) => {
	return (
		<p>
			{name} {exercises}
		</p>
	);
};

export default Course;
