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
let maxRounds = 25
let startingRound = 1

let leftImage = document.getElementById("leftImage")
let middleImage = document.getElementById("middleImage")
let rightImage = document.getElementById("rightImage")
let resultList = document.getElementById("resultList")
let resultbtn = document.getElementById("resultbtn")
let Form = document.getElementById('Form')
resultList.style.display = "none"

function Imagespropreties(imageName) {
    this.imageName = imageName.split('.')[0]
    this.imagePath = `Images/${imageName}`
    this.votes = 0
    this.views = 0
    seenImage.push(this)
}

for (let i = 0; i < imageNameArr.length; i++) {
    new Imagespropreties(imageNameArr[i])
}
let leftIndex
let rightIndex
let middleIndex

function randomNumber() {
    return Math.floor(Math.random() * seenImage.length);
}
// console.log(leftIndex)
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
    // console.log(lastImages)

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
    
    // resultList.style.display = "none"
    // console.log('condition', startingRound === maxRounds + 1)
    // console.log(startingRound , maxRounds + 1)
    if (startingRound === maxRounds + 1) {
    while (resultList.firstChild) {
        // console.log('inside while')
        resultList.removeChild(resultList.firstChild)
    }
        for (let i = 0; i < seenImage.length; i++) {
            // console.log('inside for')
            let liEl = document.createElement('li');
            resultList.appendChild(liEl);
            liEl.textContent = `${seenImage[i].imageName} had ${seenImage[i].votes} votes and was seen ${seenImage[i].views} times.`;
        }
        resultList.style.display = "block"
    }
// console.log(startingRound)
// console.log(typeof maxRounds)
// console.log(seenImage   )
}



// console.log(resultList.childElementCount)
Form.addEventListener('submit', assignRoundNumber)
function assignRoundNumber(event) {
    event.preventDefault()
    maxRounds = Number(event.target.roundNumber.value)
    // console.log(maxRounds)
    for (let i = 0; i < seenImage.length; i++) {
        seenImage[i].votes = 0
        seenImage[i].views = 0
    }
    startingRound = 1
    leftImage.addEventListener('click', clickHandler)
    middleImage.addEventListener('click', clickHandler)
    rightImage.addEventListener('click', clickHandler)
    renderImage();
}
