import { filter } from "country-codes-list";

async function fetchLocation(inputLocation) {
  function geolocation_url(location) {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=10&appid=${process.env.GEOLOC}`;
  }
  function getCountryName(country) {
    const res = filter("countryCode", country);
    return { countryName: res[0].countryNameEn, flag: res[0].flag };
  }
  try {
    const response = await fetch(geolocation_url(inputLocation));

    if (!response.ok) return;
    const data = await response.json();
    const fixedData = data.map(({ name, lat, lon, country }) => {
      const { countryName, flag } = getCountryName(country);
      return {
        name: name,
        lat: lat,
        lon: lon,
        country: countryName,
        flag: flag,
      };
    });

    return fixedData;
  } catch (err) {
    console.log(err);
    return;
  }
}




async function fetchWeather(lat, lon) {
  function weather_url(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER}&units=metric`;
    // return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER}`
  }

  function chuckDate(date) {
    return {
        year : date.getFullYear(),
        month : date.getMonth(),
        day : date.getDate(),
        hour : date.getHours(),
        minute : date.getMinutes(),
        second : date.getSeconds(),
    }
  }
  
  function responsePrettfier(item) {
    const {dt_txt, main, weather, clouds, wind, visibility, pop, rain} = item
    const {year, month, day, hour, minute, second} = chuckDate(new Date(dt_txt))
    const {temp, temp_min, temp_max,humidity} = main
    const {description} = weather[0]    
    return {
       date_time : {
           year : year,
           month : month,
           day : day,
           hour : hour,
           minute : minute,
           second : second
       },
       weather : {
          main:description,
          temp : temp,
          temp_min : temp_min,
          temp_max : temp_max,
          rain: rain,
          clouds : clouds.all,
          wind : wind,
          pop : pop,
          humidity : humidity,
          visibility : visibility,

       }
    }
  }

  try {
    const response = await fetch(weather_url(lat, lon),{
      method : "GET",
    });
    if (!response.ok) return;
    const data = await response.json();
    
    const {list, cod, message, cnt,city} = data

    const parsedResponse = list.map((item) =>  responsePrettfier(item))

    return {
      city : city.name,
      result: parsedResponse
    };
  } catch (err) {
    console.log(err);
    return;
  }
}

export {fetchLocation,  fetchWeather};
