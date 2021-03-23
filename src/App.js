import React, { useEffect, useState } from 'react';
import './App.css';
import { sortData, prettyPrintStat } from './utils';

import InfoBox from './Components/InfoBox/InfoBox';
import Map from './Components/Map/Map';
import Table from './Components/Table/Table';
import LineGraph from './Components/LineGraph/LineGraph';
import 'leaflet/dist/leaflet.css';

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@material-ui/core";

function App() {

  const baseUrl = "https://disease.sh/v3/covid-19";
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide'
      ? `${baseUrl}/all`
      : `${baseUrl}/countries/${countryCode}`;
    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
      .catch((err) => alert(`Error: ${err}`))
  };

  useEffect(() => {
    fetch(`${baseUrl}/all`)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch(`${baseUrl}/countries`)
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
        .catch((err) => alert(`Error: ${err}`))
    };
    getCountriesData();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>
                    {country.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            title="CoronaVirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            onClick={e => setCasesType('cases')}
          />
          <InfoBox
            active={casesType === "recovered"}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={e => setCasesType('recovered')}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={e => setCasesType('deaths')}
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" url={baseUrl} casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
