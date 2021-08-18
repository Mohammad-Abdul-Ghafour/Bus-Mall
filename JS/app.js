'use strict'
let imageNameArr = ['banana.jpg',
    'bathroom.jpg',
    'boots.jpg',
    'breakfast.jpg',
    'bubblegum.jpg',
    'chair.jpg',
    'cthulhu.jpg',
    'dog-duck.jpg',
    'dragon.jpg',
    'pen.jpg',
    'pet-sweep.jpg',
    'scissors.jpg',
    'shark.jpg',
    'strong-mind-strong-life-fb.jpg',
    'sweep.png',
    'tauntaun.jpg',
    'unicorn.jpg',
    'water-can.jpg',
    'wine-glass.jpg'];
let seenImage = []
let lastImages = []
let arrayOfNames = []
let imageVotes = []
let imageViews = []
let maxRounds = 25
let startingRound = 1
let leftIndex
let rightIndex
let middleIndex

let leftImage = document.getElementById("leftImage")
let middleImage = document.getElementById("middleImage")
let rightImage = document.getElementById("rightImage")
let resultList = document.getElementById("resultList")
let resultbtn = document.getElementById("resultbtn")
let loadResults = document.getElementById("loadResults")

let Form = document.getElementById('Form')
resultList.style.display = "none"

let displayChartName = document.getElementById('chartName')
displayChartName.style.display = "none"

let displayPieChart = document.getElementById('pieChart')
displayPieChart.style.display = "none"

let displayColumnChart = document.getElementById('myChart')
displayColumnChart.style.display = "none"

function Imagespropreties(imageName) {
    this.imageName = imageName.split('.')[0]
    this.imagePath = `Images/${imageName}`
    this.votes = 0
    this.views = 0
    seenImage.push(this)
    arrayOfNames.push(this.imageName)
}

for (let i = 0; i < imageNameArr.length; i++) {
    new Imagespropreties(imageNameArr[i])
}

loadData();

function randomNumber() {
    return Math.floor(Math.random() * seenImage.length);
}

function renderImage() {
    leftIndex = randomNumber()
    middleIndex = randomNumber()
    rightIndex = randomNumber()
    while (leftIndex === middleIndex || middleIndex === rightIndex || leftIndex === rightIndex || lastImages.includes(leftIndex) || lastImages.includes(middleIndex) || lastImages.includes(rightIndex)) {
        leftIndex = randomNumber()
        rightIndex = randomNumber()
        middleIndex = randomNumber()
    }
    leftImage.setAttribute('src', seenImage[leftIndex].imagePath)
    middleImage.setAttribute('src', seenImage[middleIndex].imagePath)
    rightImage.setAttribute('src', seenImage[rightIndex].imagePath)
    seenImage[leftIndex].views++
    seenImage[middleIndex].views++
    seenImage[rightIndex].views++
    lastImages[0] = leftIndex
    lastImages[1] = middleIndex
    lastImages[2] = rightIndex
}
renderImage()

leftImage.addEventListener('click', clickHandler)
middleImage.addEventListener('click', clickHandler)
rightImage.addEventListener('click', clickHandler)
function clickHandler(event) {
    event.preventDefault();
    if (startingRound <= maxRounds) {
        let clickedImage = event.target.id
        if (clickedImage == 'leftImage') {
            seenImage[leftIndex].votes++
        } else if (clickedImage == 'rightImage') {
            seenImage[rightIndex].votes++
        } else {
            seenImage[middleIndex].votes++
        }
        renderImage()
        startingRound++
    } else {
        leftImage.removeEventListener('click', clickHandler);
        middleImage.removeEventListener('click', clickHandler);
        rightImage.removeEventListener('click', clickHandler);
    }
}

resultbtn.addEventListener('click', resultHandler)
function resultHandler() {

    if (startingRound === maxRounds + 1) {
        while (resultList.firstChild) {
            resultList.removeChild(resultList.firstChild)
        }
        for (let i = 0; i < seenImage.length; i++) {
            let liEl = document.createElement('li');
            resultList.appendChild(liEl);
            liEl.textContent = `${seenImage[i].imageName} had ${seenImage[i].votes} votes and was seen ${seenImage[i].views} times.`;
            imageVotes[i] = seenImage[i].votes
            imageViews[i] = seenImage[i].views
        }
        saveData();
        if (myChart) {

            myChart.update();
        } else {

            chartRender();
        }

        pie()
        resultList.style.display = "block"
        displayPieChart.style.display = "flex"
        displayColumnChart.style.display = "block"
        displayChartName.style.display = "flex"

        resultbtn.removeEventListener('click', resultHandler);
    }
}

Form.addEventListener('submit', assignRoundNumber)
function assignRoundNumber(event) {
    event.preventDefault()
    maxRounds = Number(event.target.roundNumber.value)
    for (let i = 0; i < seenImage.length; i++) {
        seenImage[i].votes = 0
        seenImage[i].views = 0
    }
    startingRound = 1
    leftImage.addEventListener('click', clickHandler)
    middleImage.addEventListener('click', clickHandler)
    rightImage.addEventListener('click', clickHandler)
    resultbtn.addEventListener('click', resultHandler)

    renderImage();
}

let myChart;
function chartRender() {
    let ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: arrayOfNames,
            datasets: [{
                label: '# of Votes',
                data: imageVotes,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            },
            {
                label: '# of Views',
                data: imageViews,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

let chart2
let chart
function pie() {
    am4core.ready(function () {
        if (chart) {

            chart.dispose();
        }
        // Themes begin
        am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart instance
        chart = am4core.create("chartdiv", am4charts.PieChart);

        // Add data
        let chartArr = []
        for (let i = 0; i < seenImage.length; i++) {
            if (seenImage[i].views != 0) {
                chartArr.push(seenImage[i])
            }
        }
        chart.data = chartArr;

        let pieSeries = chart.series.push(new am4charts.PieSeries());

        pieSeries.dataFields.value = "views";
        pieSeries.dataFields.category = "imageName";
        pieSeries.slices.template.stroke = am4core.color("#fff");
        pieSeries.slices.template.strokeWidth = 2;
        pieSeries.slices.template.strokeOpacity = 1;
        // pieSeries.alignLabels = false
        // This creates initial animation
        pieSeries.hiddenState.properties.opacity = 1;
        pieSeries.hiddenState.properties.endAngle = -90;
        pieSeries.hiddenState.properties.startAngle = -90;
        // Add and configure Series

    });
    am4core.ready(function () {
        if (chart2) {

            chart2.dispose();
        }
        // Themes begin
        am4core.useTheme(am4themes_dataviz);
        am4core.useTheme(am4themes_animated);
        // Themes end

        // Create chart2 instance
        chart2 = am4core.create("chartdiv2", am4charts.PieChart);

        // Add data
        let chartArr = []
        for (let i = 0; i < seenImage.length; i++) {
            if (seenImage[i].votes != 0) {
                chartArr.push(seenImage[i])
            }
        }
        chart2.data = chartArr;

        // Add and configure Series
        let pieSeries2 = chart2.series.push(new am4charts.PieSeries());
        pieSeries2.dataFields.value = "votes";
        pieSeries2.dataFields.category = "imageName";
        pieSeries2.slices.template.stroke = am4core.color("#fff");
        pieSeries2.slices.template.strokeWidth = 2;
        pieSeries2.slices.template.strokeOpacity = 1;
        // pieSeries2.alignLabels = false
        // This creates initial animation
        pieSeries2.hiddenState.properties.opacity = 1;
        pieSeries2.hiddenState.properties.endAngle = -90;
        pieSeries2.hiddenState.properties.startAngle = -90;

    });
}

function saveData() {
    let getData = localStorage.getItem('data')
    let normalData =  JSON.parse(getData)
    if (normalData) {
        for (let i = 0; i < seenImage.length; i++) {
            seenImage[i].views += normalData[i].views
            seenImage[i].votes += normalData[i].votes
        }
        
    }
    let data = JSON.stringify(seenImage)
    localStorage.setItem('data', data)
}

function loadData() {
    let dataLoad = localStorage.getItem('data')
    if (dataLoad) {
        seenImage = JSON.parse(dataLoad)
    }
}

loadResults.addEventListener('click', renderLoadResults)
function renderLoadResults() {
    if (localStorage.getItem('data')) {
        while (resultList.firstChild) {
            resultList.removeChild(resultList.firstChild)
        }
        for (let i = 0; i < seenImage.length; i++) {

            let liEl = document.createElement('li');
            resultList.appendChild(liEl);
            liEl.textContent = `${seenImage[i].imageName} had ${seenImage[i].votes} votes and was seen ${seenImage[i].views} times.`;
            imageVotes[i] = seenImage[i].votes
            imageViews[i] = seenImage[i].views
        }
        if (myChart) {
            myChart.update();
        } else {
            chartRender();
        }
        pie()
        resultList.style.display = "block"
        displayPieChart.style.display = "flex"
        displayColumnChart.style.display = "block"
        displayChartName.style.display = "flex"
    }
}
