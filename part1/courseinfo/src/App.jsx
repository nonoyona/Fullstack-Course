const App = () => {
	const course = "Half Stack application development";
	const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

	return (
		<div>
			<Header course={course} />
			<Content parts={parts}/>
			<Total
				parts={parts}
			/>
		</div>
	);
};

const Header = (props) => {
	console.log(props);
	return <h1>{props.course}</h1>;
};

const Content = (props) => {

  let parts = props.parts;
  parts = parts.map((part) => {
    return (
      <Part part={part} />
    )
  });

	return (
		<div>
      {parts}
		</div>
	);
};

const Part = (props) => {
	return (
		<p>
			{props.part.name} {props.part.exercises}
		</p>
	);
};

const Total = (props) => {
	return (
		<p>
			Number of exercises{" "}
			{props.parts.reduce((acc, curr) => acc + curr.exercises, 0)}
		</p>
	);
};

export default App;
