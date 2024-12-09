"use strict";

let state = "AL";
let sex = "girl";
let year = "1960";
let queryString = "";
let names = [];
let numbers = [];
let chartTitle = "";
let myChart;

if (window.cordova) {
    document.addEventListener("deviceready", initialize, false);
} else {
    initialize();
}

function initialize() {
    const chartCanvas = document.getElementById("chartCanvasId");
    const chartContext = chartCanvas.getContext("2d");

    myChart = new Chart(chartContext, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Number of Babies Named...",
                data: numbers,
                backgroundColor: [
                    "rgba(0, 0, 255, 0.5)",
                    "rgba(255, 0, 0, 0.5)",
                    "rgba(255, 255, 255, 0.5)",
                    "rgba(255, 255, 0, 0.5)",
                    "rgba(0, 255, 0, 0.5)",
                ],
                borderColor: "grey",
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: chartTitle,
            },
            legend: {
                display: false,
            },
        },
    });

    updateQuery();
}

function updateState(value) {
    state = value;
    updateQuery();
}

function updateSex(value) {
    sex = value;
    updateQuery();
}

function updateYear(value) {
    year = value;
    updateQuery();
}

function updateQuery() {
    queryString = `
        SELECT name, number, state, sex, year 
        FROM NamesNumberByStateYear 
        WHERE state = '${state}' AND sex = '${sex}' AND year = '${year}' 
        ORDER BY number DESC LIMIT 5;
    `;
    document.getElementById("queryStingId").innerText = queryString;

    MySql.Execute(
        "sql.wpc-is.online",
        "demo",
        "demo12345",
        "BabyNames",
        queryString,
        processQueryResult
    );
}

function processQueryResult(queryReturned) {
    if (!queryReturned.Success) {
        alert(queryReturned.Error);
        return;
    }

    const results = queryReturned.Result;
    names = results.map(row => row.name);
    numbers = results.map(row => row.number);
    chartTitle = `Top ${state} ${sex.charAt(0).toUpperCase() + sex.slice(1)} Names in ${year}`;

    myChart.data.labels = names;
    myChart.data.datasets[0].data = numbers;
    myChart.options.title.text = chartTitle;
    myChart.update();
}
