import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const CountriesList = ({ countries, onShow }) => {
	if (countries == null) {
		return <div>Loading...</div>;
	}
	if (countries.length > 10) {
		return <div>Too many matches, specify another filter</div>;
	}
	if (countries.length === 1) {
		return <CountryDetails country={countries[0]} />;
	}
	if (countries.length === 0) {
		return <div>No matches found</div>;
	}

	return (
		<>
			{countries.map((country) => (
				<CountryItem key={country.cca2} country={country} onShow={onShow} />
			))}
		</>
	);
};

const CountryItem = ({ country, onShow }) => {
	return (
		<div className="item">
			{country.name.common}
			<button onClick={() => onShow(country.name.common)}>SHOW</button>
		</div>
	);
};

const CountryDetails = ({ country }) => {
	console.log("Country Data: ", country);
	const capital = country.capital[0];
	const capitalLat = country.capitalInfo;
	console.log("Capital: ", capital);

	return (
		<div>
			<h1>{country.name.common}</h1>
			<div>capital: {country.capital}</div>
			<div>area: {country.area}</div>
			<h2>languages</h2>
			<ul>
				{Object.values(country.languages).map((lang) => (
					<li key={lang}>{lang}</li>
				))}
			</ul>
			<img src={country.flags.png} alt="Flag" />
			<h2>Weather in {capital}</h2>
			<Weather
				capital={capital}
				lat={country.latlng[0]}
				lon={country.latlng[1]}
			/>
		</div>
	);
};

const Weather = ({ capital, lat, lon }) => {
	const [weather, setWeather] = useState(null);

	useEffect(() => {
		const api_key = import.meta.env.VITE_SOME_KEY;
		if (!api_key) {
			console.error("API key not found");
			return;
		}
		axios
			.get(
				`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`
			)
			.then((response) => {
				console.log("Got weather response: ", response.data);
				setWeather(response.data);
			});
	}, []);

	if (weather == null) {
		return <div>Loading weather data for {capital}...</div>;
	}

	let temperature = (weather.current.temp - 273.15).toFixed(1);
	let wind = weather.current.wind_speed;
	let icon = weather.current.weather[0].icon;

	console.log("Weather data (temp, wind, icon): ", temperature, wind, icon);

	return (
		<>
			<div>Temperature: {temperature} Celsius</div>
			<img
				src={`http://openweathermap.org/img/wn/${icon}.png`}
				alt="Weather icon"
			/>
			<div>Wind: {wind} m/s</div>
		</>
	);
};

export default CountriesList;
