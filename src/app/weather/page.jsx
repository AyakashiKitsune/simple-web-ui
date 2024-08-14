"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchLocation, fetchWeather } from "@/controller/weather_api";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Cloud,
  CloudFog,
  Droplets,
  Search,
  SunSnow,
  ThermometerSun,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WeatherCard = ({ children, className, location, ...props }) => {
  const [weatherResult, setWeatherResult] = useState(null);
  const header = [
    {
      name: "Date",
      icon: <Calendar/>,
      tooltip : "Date of the weather",
    },
    {
      name: "Weather",
      icon: <SunSnow/>,
      tooltip : "Weather either raining or sunny", 
    },
    {
      name: "Temp",
      icon: <ThermometerSun/>,
      tooltip : "Temperature forecast of the weather in celsius",
    },
    {
      name:"Rain%",
      icon: <Droplets />,
      tooltip : "How likely is it to have rain",
    },
    {
      name: "Cloud%",
      icon: <Cloud />,
      tooltip : "How cloudy is the weather",
    },
    {
      name: "Humidity",
      icon: <CloudFog/>,
      tooltip : "Humidity forecast of the weather",
    },
    {
      name: "Visibility",
      icon: <CloudFog/>,
      tooltip : "Average visibility, meters. The maximum value of the visibility is 10km",
    },
    {
      name: "Wind",
      icon: <Wind />,
      tooltip : "Wind speed and gust are meter/sec",
    }

  ]
  useEffect(() => {
    const getWeather = async () => {
      if (location == null) return;
      const result = await fetchWeather(location.lat, location.lon);

      setWeatherResult(result);
    };
    getWeather();
  }, [location]);
  return (
    <Card className={cn("transition-[width] mx-2", className)} {...props}>
      <CardHeader>
        <CardTitle>{location?.name}</CardTitle>
        <CardDescription>{location?.country}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <Table>
            <TableHeader>
              <TableRow>
                {header.map(({ name, icon, tooltip }, index) => (
                  <TableHead key={index}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TableCell className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              {icon}
                              <span>{name}</span>
                            </div>
                          </TableCell>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody >
              {weatherResult?.result.map(({ date_time, weather }, index) => {
                const dt = `${date_time.year}-${date_time.month}-${date_time.day}`;
                const curr_weather = weather.main;
                const temp = (
                  <p className="flex flex-col">
                    <span>{`ave: ${weather.temp}`}</span>
                    <span>{`min: ${weather.temp_min}`}</span>
                    <span>{`max: ${weather.temp_max}`}</span>
                  </p>
                );
                const rain = () => {
                  if (weather.rain) {
                    return weather.rain["3h"];
                  } else {
                    return 0;
                  }
                };
                const clouds = weather.clouds;
                const humidity = weather.humidity;
                const visibility = (weather.visibility / 10_000) *100 ;
                const wind = (
                  <p className="flex flex-col">
                    <span>{`speed: ${weather.wind.speed}`}</span>
                    <span>{`dir: ${weather.wind.deg} deg`}</span>
                    <span>{`gust:(${weather.wind.gust})`}</span>
                  </p>
                );
                return (
                  <TableRow>
                    <TableCell className="font-medium">{dt}</TableCell>
                    <TableCell>{curr_weather}</TableCell>
                    <TableCell>{temp}</TableCell>
                    <TableCell>{rain()}%</TableCell>
                    <TableCell>{clouds}%</TableCell>
                    <TableCell>{humidity}%</TableCell>
                    <TableCell>{visibility}%</TableCell>
                    <TableCell>{wind}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const WeatherSearchBar = ({
  children,
  className,
  onSelectedLocation,
  ...props
}) => {
  const [cacheSearch, setCacheSearch] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const searchRef = useRef("");
  const handleSearchClick = () => {
    setSearchQuery(searchRef.current.value);
  };
  const handleSearchPerEnter = async (searchInput) => {
    return await fetchLocation(searchInput);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (searchRef.current.value.length > 1) {
        const searchq = cacheSearch.map((item) => item.name);
        if (!searchq.includes(searchRef.current.value)) {
          const result = await handleSearchPerEnter(searchRef.current.value);
          const newCacheSearch = cacheSearch;
          newCacheSearch.push({
            name: searchRef.current.value,
            result: result,
          });
          setCacheSearch(() => newCacheSearch);
          setSearchResult(() => result);
          console.log("new", newCacheSearch);
        } else {
          console.log("cache", cacheSearch);
          setSearchResult(
            () =>
              cacheSearch.filter(
                ({ name }) => name === searchRef.current.value
              )[0].result
          );
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex flex-col max-w-xl w-full h-full items-start justify-start px-2 mx-2 min-w-72",
          className
        )}
      >
        <Label
          htmlFor="location_search"
          className={cn("m-2 col-span-2 text-foreground", className)}
        >
          Location
        </Label>

        <div className="flex flex-row items-center w-full gap-2">
          <Input
            id="location_search"
            className={cn("w-full h-12", className)}
            ref={searchRef}
            placeholder="Search location"
            {...props}
          />
          <Button className="size-12" onClick={handleSearchClick}>
            <Search />
          </Button>
        </div>

        <ScrollArea className="w-full h-full mt-2 px-2 -p-1">
          <ul className="size-full flex flex-col transition-all gap-2  rounded-lg shadow-md">
            {searchResult?.map(({ name, lat, lon, country, flag }, index) => (
              <li
                id={name}
                key={index}
                className="rounded-lg bg-primary text-primary-foreground py-2 px-3 group group-checked:bg-white"
                onClick={() => {
                  const chkbox = document.getElementById(name + index);
                  // const item = document.getElementById(name);
                  if (chkbox.checked) {
                    chkbox.checked = false;
                    // item.classList.add("")
                    onSelectedLocation(null);
                  } else {
                    chkbox.checked = true;
                    onSelectedLocation({
                      lat: lat,
                      lon: lon,
                      name: name,
                      country: country,
                    });
                  }
                }}
              >
                <input id={name + index} type="checkbox" className="hidden group checked" />
                <p className="group-checked:underline">
                  {name}-{country}-{flag}
                </p>
                <p>
                  {lat}-{lon}
                </p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </>
  );
};

const WeatherContent = ({ children, className, ...props }) => {
  return (
    <>
      <div
        className={cn("flex justify-center w-full", "pt-8", className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

const WeatherContainer = ({ children, className, ...props }) => {
  return (
    <>
      <div
        className={cn("flex flex-1 justify-center h-[720px]", className)}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

const Weather = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cacheWeather, setCacheWeather] = useState(null);
  return (
    <>
      <WeatherContainer suppressHydrationWarning>
        <WeatherContent>
          <WeatherSearchBar onSelectedLocation={setSelectedLocation} />
          <WeatherCard
            location={selectedLocation}
            className={cn("w-0 duration-700 shadow-lg border-0", selectedLocation && "w-full")}
          />
        </WeatherContent>
      </WeatherContainer>
    </>
  );
};

export default Weather;
