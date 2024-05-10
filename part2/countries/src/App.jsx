import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";
import CountriesList from "./components/Country"



const App = () => {
	const [query, setQuery] = useState("");
	const handleQueryChange = (e) => {
		console.log("Filter value: ", e.target.value);
		setQuery(e.target.value);
	};

  const handleShow = (name) => {
    console.log("Show: ", name);
    setQuery(name);
  }

	const [countries, setCountries] = useState(null);

	useEffect(() => {
		axios
			.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
			.then((response) => {
				console.log("Got response (length): ", response.data.length);
				setCountries(response.data);
			});
	}, []);

	const filteredCountries = countries
		? countries.filter((country) =>
				country.name.common.toLowerCase().includes(query.toLowerCase())
		  )
		: null;

	console.log(
		"Filtered countries (len): ",
		filteredCountries ? filteredCountries.length : "null"
	);

	return (
		<>
			<div className="search">
				find countries <input value={query} onChange={handleQueryChange} />
			</div>
			<CountriesList countries={filteredCountries} onShow={handleShow} />
		</>
	);
};

export default App;
