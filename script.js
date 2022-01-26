// const { doc } = require("prettier");

//VARIABLES
const firstPage = document.getElementById("first");
const secondPage = document.getElementById("second");
const downBtn = document.getElementById("arrowdown");
const upBtn = document.getElementById("arrowup");
const findBtn = document.getElementById("firstinputbtn");
const firstPageInput = document.getElementById("firstpageinput");
const firstPageImg = document.getElementById("firstimg");
const firstPageYear = document.getElementById("year");
const firstPageActor = document.getElementById("actor");
const firstPageCountry = document.getElementById("country");
const firstPageFlag = document.getElementById("flagimg");
const firstPageCurrency = document.getElementById("currency");
const firstPageInfo = document.getElementById("firstinfo");

function RenderData({ year, poster, actor, countrydata }) {
  const actorNames = actor.join(", ");
  let countryDataTemplate = "";
  console.log(countrydata);
  for (let i = 0; i < countrydata.length; i++) {
    // countryDataTemplate += `${countrydata[i].name}, ${countrydata[
    //   i
    // ].currency.join(", ")} <img src=${countrydata[0].flags}/> <br>`;
    console.log(countrydata[i]);
  }
  // for (let country of countrydata) {
  //   console.log(country);
  //   countryDataTemplate += `${country.name}, ${country.currency.join(
  //     ", "
  //   )} <img src=${country.flags}/> <br>`;
  // }
  console.log(countryDataTemplate);
  let html = `<img id="firstimg" src="${poster}" alt="" />
  <ul id="firstul">
    <li id="year">Released ${year} years ago</li>
    <li id="actor">Actors: ${actorNames}</li>
    <li id="country">Country: ${countryDataTemplate}</li>
  </ul>`;
  firstPageInfo.insertAdjacentHTML("beforeend", html);
}

// function DisplayData(year, poster, actor, country, currency, flag) {
//   firstPageYear.textContent = `Released ${year} years ago`;
//   firstPageImg.src = `${poster}`;
//   actor.forEach((user) => {
//     firstPageActor.textContent += ` ${user}`;
//   });
//   country.forEach((c) => {
//     firstPageCountry.textContent += ` ${c}`;
//   });
//   currency.forEach((cur) => {
//     firstPageCurrency.textContent += cur;
//   });
//   flag.forEach((f) => {
//     firstPageCurrency.textContent += f;
//   });
// }

function CalculateDate(date) {
  date = +date.split(" ").pop();
  return new Date().getFullYear() - date;
}

function getMovie(name) {
  return fetch(
    `http://www.omdbapi.com/?t=${name}&plot=full&apikey=5bbba32d`
  ).then((response) => response.json());
}

async function GetMovieData(name) {
  const obj = {
    actor: [],
    countrydata: [],
  };
  let { Released, Actors, Country, Poster } = await getMovie(name);

  Actors = Actors.split(",");
  Actors.forEach((actor) => {
    actor = actor.trim();
    obj.actor.push(actor.split(" ")[0]);
  });

  Country = Country.split(",");
  Country.forEach(async (country) => {
    country = country.trim();
    const countryData = await getCountryData(country);
    const flags = countryData[0].flags.png;
    const currency = [];
    for (let curr in countryData[0].currencies) {
      currency.push(curr);
    }
    obj.countrydata.push({ name: country, currency, flags });
  });

  obj.poster = Poster;
  obj.year = CalculateDate(Released);
  return obj;
}

function getCountryData(country) {
  return fetch(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`
  ).then((res) => res.json());
}

GetMovieData("titanic");

//---------------

// downBtn.addEventListener("click", () => {
//   secondPage.scrollIntoView({ behavior: "smooth" });
// });

// upBtn.addEventListener("click", () => {
//   firstPage.scrollIntoView({ behavior: "smooth" });
// });

findBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let InputValue = firstPageInput.value;
  GetMovieData(InputValue).then((x) => RenderData(x));
});
