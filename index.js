const fs = require("fs");
const port = process.env.PORT || 5000
const express = require("express");
const app = express();

const HOME = fs.readFileSync("index.html", "utf-8");   //homepage
// console.log(HOME);
// const replaceVal = (htmlfile, org)=>{
//     var htmldata = htmlfile.replace("{%tempval%}",org.main.temp);
//     htmldata = htmlfile.replace("{%tempMin%}", org.main.temp_min);
//     htmldata = htmlfile.replace("{%tempMax%}",org.main.temp_max);
//     htmldata = htmlfile.replace("{%location%}",org.name)
//     htmldata = htmlfile.replace("{%country%}",org.sys.country)

//     return htmldata;
// };

app.get("/", async (req, res) => {
    try {
        const url = "https://api.openweathermap.org/data/2.5/weather?q=Navi Mumbai&appid=8fc9e91887085dfdc191aa0f55d864bd";

        const response = await fetch(url);
        const data = await response.json();
        console.log(data.dt, data.main.temp);

        const realTimeData = HOME
            .replace("{%tempval%}", (data.main.temp - 273.15).toFixed(2))
            .replace("{%tempMin%}", (data.main.temp_min - 273.15).toFixed(2))
            .replace("{%tempMax%}", (data.main.temp_max - 273.15).toFixed(2))
            .replace("{%location%}", data.name)
            .replace("{%country%}", data.sys.country)
            .replace("{%tempstat%}", data.weather[0].main);

        res.set('Cache-Control', 'no-store');
        res.send(realTimeData);
    } catch (err) {
        console.error("Error fetching weather data:", err);
        res.status(500).send("Something went wrong fetching the weather.");
    }
});

app.listen(port, () => {
    console.log("listening at port ",port);
})
