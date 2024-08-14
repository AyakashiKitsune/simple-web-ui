const data = require("./weather.json");
const {list, cod, message, cnt,city} = data
const date = new Date(0);
const parsedate = list.map(({dt, main,weather,clouds,wind,visibility,rain, }) => new Date(dt * 1000).toLocaleString())
// const parsedate = list.map(({dt_txt}) => chuckDate(new Date(dt_txt)))
for (let index = 0; index < parsedate.length; index++) {
    const element = parsedate[index];
    console.log(element);
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
