// let records=null;
// fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0002-001?Authorization="+CWB_API_KEY).then((response)=>{
// 	return response.json();
// }).then((data)=>{
// 	records=data.records;
// 	renderRaining(0);
// });
// function renderRaining(page){
// 	let startIndex=page*10;
// 	let endIndex=(page+1)*10;
// 	const container=document.querySelector("#raining");
// 	for(let i=startIndex;i<endIndex;i++){
// 		const location=records.location[i];
// 		const item=document.createElement("div");
// 		item.className="location";
// 		const town=document.createElement("div");
// 		town.className="town";
// 		town.textContent=location.parameter[0].parameterValue+"、"+location.parameter[2].parameterValue;
// 		const amount=document.createElement("amount");
// 		amount.className="amount";
// 		amount.textContent=location.weatherElement[6].elementValue+" mm";
// 		item.appendChild(town);
// 		item.appendChild(amount);
// 		container.appendChild(item);
// 	}
// }

//  日期 ＆ 時間
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");

function getCurrentDate() {
  const now = new Date();

  let years = formatNumber(now.getFullYear());
  let months = formatNumber(now.getMonth() + 1);
  let days = formatNumber(now.getDate());

  let nowDate = `${years}-${months}-${days}`;

  return nowDate;
}

function getNextDate() {
  const now = new Date();

  let years = formatNumber(now.getFullYear());
  let months = formatNumber(now.getMonth() + 1);
  let days = formatNumber(now.getDate() + 1);

  let nextDate = `${years}-${months}-${days}`;

  return nextDate;
}

function getCurrentTime() {
  const now = new Date();

  let hours = formatNumber(now.getHours());
  let minutes = formatNumber(now.getMinutes());
  let seconds = formatNumber(now.getSeconds());

  let currentTime = `${hours} : ${minutes} : ${seconds}`;
  return currentTime;
}

function formatNumber(number) {
  return number < 10 ? `0${number}` : number;
}

function updateDateTimeElements() {
  const nowDate = getCurrentDate();
  const currentTime = getCurrentTime();

  dateElement.textContent = `日期：${nowDate}`;
  timeElement.textContent = `現在時間：${currentTime}`;
}

setInterval(updateDateTimeElements, 1000);

const countyElement = document.querySelector(".county");
const countyValue = countyElement.textContent;

// 當天天氣
// https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${key}

const apiKey = "CWB-6DB1B8BA-C3F5-49F7-8443-999865A34532"; // 先用別人的

function getWeatherData() {
  const nowDate = getCurrentDate();
  const nextDate = getNextDate();
  const apiUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-089?Authorization=${apiKey}&locationName=${countyValue}&timeFrom=${nowDate}&timeTo=${nextDate}`;

  return fetch(apiUrl, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      //   console.log(data.records.locations[0].location[0]);
      return data.records.locations[0].location[0];
    })
    .catch((e) => {
      console.log(e);
    });
}

async function updateWeatherElements() {
  try {
    const weatherData = await getWeatherData();

    const Wx = weatherData.weatherElement[1].time[0].elementValue[0].value;
    const T = weatherData.weatherElement[3].time[0].elementValue[0].value;
    const PoP6h = weatherData.weatherElement[7].time[0].elementValue[0].value;
    const Ws = weatherData.weatherElement[8].time[0].elementValue[0].value;

    const WxElement = document.getElementById("Wx");
    const TElement = document.getElementById("T");
    const PoP6hElement = document.getElementById("PoP6h");
    const WsElement = document.getElementById("Ws");

    WxElement.textContent = `天氣現象：${Wx}`;
    TElement.textContent = `溫度：${T} ℃`;
    PoP6hElement.textContent = `6小時降雨機率：${PoP6h} %`;
    WsElement.textContent = `風速：${Ws} m/s`;
  } catch (e) {
    console.log(e);
  }
}

// 36小時天氣
// https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${key}

function getWeatherData36H() {
  const nowDate = getCurrentDate();
  const nextDate = getNextDate();
  const apiUrl = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${apiKey}&locationName=${countyValue}&timeFrom=${nowDate}&timeTo=${nextDate}`;

  return fetch(apiUrl, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      //   console.log(
      //     data.records.locations[0].location[0].weatherElement[6].time[1]
      //       .elementValue[0].value
      //   );
      let weatherData36H = data.records.locations[0].location[0];
      let weatherData36HArray = [];

      for (let i = 1; i <= 3; i++) {
        let startTime = weatherData36H.weatherElement[6].time[i].startTime;
        let endTime = weatherData36H.weatherElement[6].time[i].endTime;
        let timeDescribe;
        let timeBase = startTime.substr(11);
        let dateBase = startTime.substr(0, 10);
        console.log(timeBase);

        if (
          (dateBase == nowDate && timeBase == "06:00:00") ||
          (dateBase == nowDate && timeBase == "12:00:00")
        ) {
          timeDescribe = "今天白天";
        } else if (dateBase == nowDate && timeBase == "18:00:00") {
          timeDescribe = "今晚明晨";
        } else if (dateBase == nextDate && timeBase == "06:00:00") {
          timeDescribe = "明天白天";
        } else if (dateBase == nextDate && timeBase == "18:00:00") {
          timeDescribe = "明天晚上";
        } else {
          timeDescribe = "後天白天";
        }

        let Wx = weatherData36H.weatherElement[6].time[i].elementValue[0].value;
        let T = weatherData36H.weatherElement[1].time[i].elementValue[0].value;
        let PoP12h =
          weatherData36H.weatherElement[0].time[i].elementValue[0].value;

        let weatherInterval = {
          startTime: startTime,
          endTime: endTime,
          timeDescribe: timeDescribe,
          Wx: Wx,
          T: T,
          PoP12h: PoP12h,
        };
        weatherData36HArray.push(weatherInterval);
      }
      return weatherData36HArray;
    })
    .catch((e) => {
      console.log(e);
    });
}

async function updateWeather36HElements() {
  try {
    const weatherData36H = await getWeatherData36H();
    console.log(weatherData36H);
    const container = document.getElementById("weatherDataContainer");
    weatherData36H.forEach((item) => {
      const weatherElement = document.createElement("div");
      weatherElement.innerHTML = `
	  	<div id="startTime">起始日期：${item.startTime}</div>
	  	<div id="endTime">結束日期：${item.endTime}</div>
		<div id="timeDescribe">日期描述：${item.timeDescribe}</div>
		<div id="Wx">天氣現象：${item.Wx}</div>
		<div id="T">溫度：${item.T} ℃</div>
		<div id="PoP12h">降雨機率：${item.PoP12h} %</div>
		<hr>`;
      container.appendChild(weatherElement);
    });
  } catch (e) {
    console.log(e);
  }
}

updateWeatherElements();
updateWeather36HElements();
