let color = '#000000';
let shapeType = 'line';
let canvas = document.getElementById('canvas');
let startCoords = {};
let currentShape;
let pallete = document.querySelector('.color');
let shapePallete = document.getElementById('shape');

for (let btn of pallete.getElementsByTagName('div')) {
    btn.style.setProperty('background-color', btn.dataset.color);
    btn.style.setProperty('cursor', 'pointer');
    // btn.addEventListener('click', function(event){color = btn.dataset.color})
}

pallete.addEventListener('click', function (event) {
    let target = event.target;
    let btn = target.closest('div');
    if (btn.tagName == 'DIV') {
        color = target.dataset.color;
    }
})

shapePallete.addEventListener('click', function (event) {
    let target = event.target;
    let btn = target.closest('div');
    if (btn.tagName == 'DIV') {
        shapeType = target.dataset.shape;
    }
    shapePallete.querySelector('div.shape').classList.remove('shape');
    btn.classList.add('shape');
    console.log(shapeType);
})

canvas.addEventListener('mousedown', function (event) {
    startCoords.x = event.offsetX;
    startCoords.y = event.offsetY;
})

function calcRadius(startCoordinates, endCoordinates) {
    let dx = (startCoordinates.x - endCoordinates.x),
        dy = (startCoordinates.y - endCoordinates.y);
    return Math.sqrt(dx ** 2 + dy ** 2);

}

function drawLine(event, startCoordinates, endCoordinates) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute('x1', startCoordinates.x);
    line.setAttribute('y1', startCoordinates.y);
    line.setAttribute('x2', endCoordinates.x);
    line.setAttribute('y2', endCoordinates.y);
    line.setAttribute('stroke', color);
    canvas.appendChild(line);
    return line;
}

function drawPencil(event, coordinates) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', coordinates.x);
    circle.setAttribute('cy', coordinates.y);
    circle.setAttribute('r', 1);
    circle.setAttribute('stroke', color);
    circle.setAttribute('fill', color);
    canvas.appendChild(circle);
    return circle;
}

function drawCircle(event, startCoordinates, endCoordinates) {
    let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute('cx', startCoordinates.x);
    circle.setAttribute('cy', startCoordinates.y);
    circle.setAttribute('r', calcRadius(startCoordinates, endCoordinates));
    circle.setAttribute('stroke', color);
    circle.setAttribute('fill', 'none');
    canvas.appendChild(circle);
    return circle;
}


function drawRectangle(event, startCoordinates, endCoordinates) {
    let shiftPressed = event.shiftKey;
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', Math.min(startCoordinates.x, endCoordinates.x));
    rect.setAttribute('y', Math.min(startCoordinates.y, endCoordinates.y));
    let width = Math.abs(endCoordinates.x - startCoordinates.x),
        height = Math.abs(endCoordinates.y - startCoordinates.y);
    if (shiftPressed) {
        let edgeLenght = Math.max(width, height);
        rect.setAttribute('width', edgeLenght);
        rect.setAttribute('height', edgeLenght);
    } else {
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
    }

    rect.setAttribute('stroke', color);
    rect.setAttribute('fill', 'none');
    canvas.appendChild(rect);
    return rect;
}

function drawShape(event, startCoordinates, endCoordinates) {
    if (shapeType == 'line') {
        return drawLine(event, startCoordinates, endCoordinates);
    } else if (shapeType == 'circle') {
        return drawCircle(event, startCoordinates, endCoordinates);
    } else if (shapeType == 'rectangle') {
        return drawRectangle(event, startCoordinates, endCoordinates);
    } else if (shapeType == 'pencil') {
        return drawPencil(event, endCoordinates);
    } else {
        console.log(`Error: ${shapeType} not exists.`);
    }

}

canvas.addEventListener('mouseup', function (event) {
    let endCoords = {
        x: event.offsetX,
        y: event.offsetY,
    };

    drawShape(event, startCoords, endCoords);
})

canvas.addEventListener('mousemove', function (event) {
    if (event.buttons == 0) {
        return;
    }
    let endCoords = {
        x: event.offsetX,
        y: event.offsetY,
    };

    if ((currentShape !== null) && (currentShape !== undefined) && (shapeType != 'pencil')) {
        canvas.removeChild(currentShape);
    }

    currentShape = drawShape(event, startCoords, endCoords);

})

