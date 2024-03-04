import { useEffect, useState } from "react";
import "./App.css";
import dayTimeImg from "./assets/desktop/bg-image-daytime.jpg";
import nightTimeImg from "./assets/desktop/bg-image-nighttime.jpg";

export default function App() {
  const [zone, setZone] = useState("CET");
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(11);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [dayOfYear, setDayOfYear] = useState(64);
  const [weekNumber, setWeekNumber] = useState(10);
  const [timezone, setTimezone] = useState("Europe/Belgrade");

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  const [city, setCity] = useState("Belgrade");
  const [countryCode, setCountryCode] = useState("Serbia");

  const [showDetails, setShowDetails] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(function () {
    async function fetchTime() {
      const response = await fetch("http://worldtimeapi.org/api/ip");
      const data = await response.json();
      const localTIme = new Date(data.utc_datetime);
      const getHours = localTIme.getHours();
      const getMinutes = localTIme.getMinutes();

      setZone(data.abbreviation);
      setHours(getHours);
      setMinutes(getMinutes);
      setDayOfWeek(data.day_of_week);
      setDayOfYear(data.day_of_year);
      setWeekNumber(data.week_number);
      setTimezone(data.timezone);
    }
    fetchTime();
  }, []);

  useEffect(
    function () {
      async function fetchQuote() {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();

        setQuote(data.content);
        setAuthor(data.author);
      }

      if (shouldRefresh) fetchQuote();

      fetchQuote();
    },
    [shouldRefresh]
  );

  useEffect(function () {
    async function fetchQuote() {
      const response = await fetch(
        "https://api.ipbase.com/v2/info?apikey=ipb_live_NLECg8WexKMtdePWQDhEnXurAe13VKykNDk7IHI9"
      );
      const data = await response.json();

      setCity(data.data?.location.city.name);
      setCountryCode(data.data?.location.country.alpha3);
    }
    fetchQuote();
  }, []);

  function handleShowDetails() {
    setShowDetails((prevState) => !prevState);
  }

  function handleRefresh() {
    setShouldRefresh((prevState) => !prevState);
  }

  return (
    <main
      style={{
        backgroundImage:
          hours >= 5 && hours < 18
            ? `url(${dayTimeImg})`
            : `url(${nightTimeImg})`,
      }}
    >
      <div className={`container ${showDetails && "half"}`}>
        <div className="box">
          <Quote quote={quote} author={author} onRefresh={handleRefresh} />
          <Time
            hours={hours}
            minutes={minutes}
            zone={zone}
            city={city}
            countryCode={countryCode}
          />
        </div>
        <div>
          <Button onShowDetails={handleShowDetails} />
        </div>
      </div>
      {showDetails && <Details />}
    </main>
  );
}

function Quote({ quote, author, onRefresh, showDetails }) {
  return (
    <div className="quote-container">
      <div className={`quote-box`}>
        <p className="quote">"{quote}"</p>
        <button className="refresh-btn" onClick={onRefresh}>
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.188 10.667a.208.208 0 01.147.355l-2.344 2.206a5.826 5.826 0 009.578-2.488l2.387.746A8.322 8.322 0 013.17 14.94l-2.149 2.022a.208.208 0 01-.355-.148v-6.148h6.52zm7.617-7.63L16.978.958a.208.208 0 01.355.146v6.23h-6.498a.208.208 0 01-.147-.356L13 4.765A5.825 5.825 0 003.43 7.26l-2.386-.746a8.32 8.32 0 0113.76-3.477z"
              fill="#FFF"
              fillRule="nonzero"
              opacity=".5"
            />
          </svg>
        </button>
      </div>
      <div className="quote-author">
        <p className="author">{author}</p>
      </div>
    </div>
  );
}

function Time({ hours, minutes, zone, city, countryCode, showDetails }) {
  return (
    <div className={`time-container ${showDetails && "proba"}`}>
      <div className="part-of-day">
        {hours >= 5 && hours < 12 && (
          <>
            <svg
              className="rotating"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
                fill="#FFF"
                fillRule="nonzero"
              />
            </svg>
            Good morning
          </>
        )}
        {hours >= 12 && hours < 18 && (
          <>
            <svg
              className="rotating"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.78 19.417c.594 0 1.083.449 1.146 1.026l.006.125v1.842a1.152 1.152 0 01-2.296.125l-.007-.125v-1.842c0-.636.516-1.151 1.152-1.151zM6.382 17.18a1.15 1.15 0 01.09 1.527l-.09.1-1.302 1.303a1.152 1.152 0 01-1.718-1.528l.09-.1 1.302-1.302a1.15 1.15 0 011.628 0zm12.427 0l1.303 1.303a1.15 1.15 0 11-1.628 1.627L17.18 18.81a1.15 1.15 0 111.628-1.628zM11.781 5.879a5.908 5.908 0 015.901 5.902 5.908 5.908 0 01-5.901 5.902 5.908 5.908 0 01-5.902-5.902 5.908 5.908 0 015.902-5.902zm10.63 4.75a1.151 1.151 0 110 2.303h-1.843a1.151 1.151 0 110-2.303h1.842zm-19.418 0a1.151 1.151 0 01.126 2.296l-.125.007H1.15a1.151 1.151 0 01-.125-2.296l.125-.007h1.842zm1.985-7.268l.1.09 1.303 1.302a1.151 1.151 0 01-1.528 1.718l-.1-.09L3.45 5.08A1.15 1.15 0 014.978 3.36zm15.133.09c.45.449.45 1.178 0 1.628L18.808 6.38a1.151 1.151 0 11-1.628-1.628l1.303-1.303c.449-.449 1.178-.449 1.628 0zM11.781 0c.636 0 1.151.515 1.151 1.151v1.843a1.152 1.152 0 01-2.303 0V1.15C10.63.515 11.145 0 11.781 0z"
                fill="#FFF"
                fillRule="nonzero"
              />
            </svg>
            Good afternoon
          </>
        )}
        {hours >= 18 && (
          <>
            <svg width="23" height="24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.157 17.366a.802.802 0 00-.891-.248 8.463 8.463 0 01-2.866.482c-4.853 0-8.8-3.949-8.8-8.8a8.773 8.773 0 013.856-7.274.801.801 0 00-.334-1.454A7.766 7.766 0 0012 0C5.382 0 0 5.382 0 12s5.382 12 12 12c4.2 0 8.02-2.134 10.218-5.709a.805.805 0 00-.061-.925z"
                fill="#FFF"
                fill-rule="nonzero"
              />
            </svg>
            Good evening
          </>
        )}
        , it's currently
      </div>
      <div className="time">
        <p>
          <span className="hours">{hours < 10 ? `0${hours}` : hours}:</span>
          <span className="minutes">
            {minutes < 10 ? `0${minutes}` : minutes}
          </span>
          <span className="zone"> {zone}</span>
        </p>
      </div>
      <div className="country-box">
        <p>
          in {city}, {countryCode}
        </p>
      </div>
    </div>
  );
}

function Button({ onShowDetails }) {
  return (
    <button className="btn" onClick={onShowDetails}>
      <span>More</span>

      <div className="arrow">
        <svg width="14" height="9" xmlns="http://www.w3.org/2000/svg">
          <path stroke="#FFF" strokeWidth="2" fill="none" d="m1 1 6 6 6-6" />
        </svg>
      </div>
    </button>
  );
}

function Details({ dayOfWeek, dayOfYear, weekNumber, timezone }) {
  return (
    <div className="details-container">
      <div className="column-one">
        <div className="column-one-box">
          <p className="heading">Current timezone</p>
          <p className="text">Europe/London</p>
          {/* <p className="text">{timezone}</p> */}
        </div>
        <div className="column-one-box">
          <p className="heading">Day of the year</p>
          <p className="text">295</p>
          {/* <p className="text">{dayOfYear}</p> */}
        </div>
      </div>
      <div className="column-two">
        <div className="column-two-box">
          <p className="heading">Day of the week</p>
          <p className="text">1</p>
          {/* <p className="text">{dayOfWeek}</p> */}
        </div>
        <div className="column-two-box">
          <p className="heading">Week number</p>
          <p className="text">42</p>
          {/* <p className="text">{weekNumber}</p> */}
        </div>
      </div>
    </div>
  );
}
