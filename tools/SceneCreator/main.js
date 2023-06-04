const   blur            = document.querySelectorAll(".blur")[0];
const   canvas          = document.querySelectorAll("canvas")[0];
const   ctx             = canvas.getContext('2d');
const   coords          = document.querySelector("#mousePos")
const   raw             = document.querySelector("#scene-content")
var     origin          = {x: 0, y: 0};
var     originData      =
{
    speed: 10,
    startPosition: {x:0, y:0}
}
var     selectedObject  = null;

// undo system variables
var     actionsHistory  = [];
var     undoIndex       = 0;
var     maxUndoIndex    = 0;



let     entities        = [];
var     previewEntitiesList = [];

var selection = 
{
    dotSize:    10,
    lineColor:  'black',
    rectLineSize:1.5,
    lineSize:   2,
    rect:       [],
    upDots:     [[], [], []],
    middleDots: [[], [], []],
    downDots:   [[], [], []],
}
var createElements = 
{
    firstPos: [0, 0],
    lastPos: [0, 0],
}
var switches =
{
    showCoordinates: true,
    showGrid: true,
    lockGrid: true,
    showScreenBlueprint: true,
    middleButtonDown: false,
    movingAction: null,
    moving: false,
    distanceSet: false
}
const canvasConfig  =
{
    fillColor   : "#D6E5FA",
    width       : 300,
    height      : 300,
    gridSize    : 64,
    scale       : 3,
    maxZoom     : 15,
    minZoom     : 3,
    zoomSpeed   : 0.5,
    lineSize    : 0.3,
    zoom        : 100,
    getGriddedPosition:
    function(x)
    {
        
        if(!isValid(x)) return;
        if(!switches.lockGrid)return x;
        x = Math.floor(x/this.gridSize)*this.gridSize;
        return x;
    }
}
var sceneManager = 
{

    insertElementInScene:
    function(scene, element)
    {
        scene.elements.push(element)
        updateActionsHistory(sceneManager.getSelectedSceneList());
        

    },
    concatArrayInScene:
    function(scene, list)

    {
        if(!isValid(list))return false;
        scene.elements = concatElementInList(scene.elements, list)
    },

    getSceneByName:
    function(name)
    {
        var sceneIndex  = getIndexOfElementInList(this.list, name, 'name');
        var scene       = this.list[sceneIndex];

        return scene;
    },
    getSelectedSceneProperty:
    function(prop)
    {
        var prop = this.getSelectedScene()[prop];
        if (!isValid(this.getSelectedScene()) || !isValid(prop)) return false;
        
        return prop;
    },
    getSelectedSceneList: function(){return this.getSelectedSceneProperty("elements");},
    getSelectedSceneName: function(){return this.getSelectedSceneProperty("name");},
    
    getSelectedScene: 
    function()
    {
        var index = getIndexOfElementInList(this.list, this.selectedScene, 'name');
        var selectedScene = this.list[index]
        if (!isValid(selectedScene)) return false;

        return selectedScene;
    },
    createNewScene:
    function(name)
    {
        if (this.isAValidScene(name) || !isStringValid(name))return;
        this.list.push({'name': name, elements: []})
    },
    isAValidScene:
    function(name)
    {
        return isValid(getIndexOfElementInList(this.list, name, "name"))
    },
    changeSelectedScene:
    function(name)
    {
        if(!this.isAValidScene(name))return false;//
        this.selectedScene = name;
    },
    replaceSceneList:
    function(scene, list)
    {
        scene.elements = list;
    },
    replaceSelectedSceneList:
    function(list)
    {
        this.replaceSceneList(this.getSelectedScene(), list);
    },


    selectedScene   : 'main',
    list            : [{name: "main", elements: []}]
}

var mousePosition =
{
    isDragging: false,
    mouseover: false,
    x: 0,
    y: 0
}


var selected =
{
 
    scene       : null,
    tool        : null,
    element     : null
}

function getSelected (option)
{
    if(!isValid(option) || selected[option] == null) return false;
    return selected[option];
};

function isSelected (option)
{
    if (!isValid(option)) return false;
    return selected[option] == null;
};

function isValid (option)
{
    return Object.keys(selected).indexOf(option) != -1;
};

function getSelectedTool ()
{
    return getSelected('tool')
};

function getSelectedToolId ()
{
    if(!isValid('tool')) return false;
    return getSelectedTool().id;
};

function isToolSelected ()
{
    return isSelected('tool');
};

function getSelectedElement()
{
    return getSelected('element');
};

function getSelectedElementId()
{
    if(!isValid('element')) return false;
    return getSelectedElement().id;
};

function isElementSelected()
{
    return isSelected('element')
};


// Frontend
function updateHTMLCoords()
{
    if(!switches.showCoordinates)
    {
        coords.classList.add("invisible")
        return
    }

    coords.classList.remove("invisible")
    coords.innerText = "X: "+ Math.floor(mousePosition.x) +"; Y: "+Math.floor(mousePosition.y);
}
function changePopup(container)
{

    if(isVisible(container))

    {setInvisible(container);setInvisible(blur)}


    else
    {setVisible(container);setVisible(blur)}

}


function createScene(element)
{
    var HTMLScenesList = document.querySelector("#scenes-list");
    var newSceneName = document.querySelector("#create-scene-input").value;
    sceneManager.createNewScene(newSceneName);
    updateHTMLScenesList()
    resetInput(document.querySelector("#create-scene-input"))

    console.log(isStringValid(newSceneName))
    if (isStringValid(newSceneName))
    {
        changePopup(document.querySelector("#add-scene-popup"))
        setInvisible(document.querySelector("#create-scene-error"))
        HTMLScenesList.scrollLeft = 2000000;
    }
    else
    {
        changeVisibility(document.querySelector("#create-scene-error"));
        setTimeout(
            function(){changeVisibility(document.querySelector("#create-scene-error"))}, 300 
        )
    }
}
    // Dependencies
    function resetScenesListInHTML()
    {
        var scenesListHTML = document.querySelector("#scenes-list");
        scenesListHTML.innerHTML = "";
    }

    function updateHTMLScenesList(element)
    {
        resetScenesListInHTML()
        var scenesListNames = sceneManager.list.map((element) => {return Object.values(element)[0]});


        scenesListNames.map((element) => 
        {
            
            var HTMLScenesList  = document.querySelector("#scenes-list");
            var HTMLSceneNode   = document.createElement("li");
            HTMLSceneNode.setAttribute("onclick", "changeSelectedScene(this)");
            HTMLSceneNode.innerText = element;
            if(element == sceneManager.selectedScene)
            {
                HTMLSceneNode.classList.add('selected')
            }
            HTMLScenesList.appendChild(HTMLSceneNode)
        })

        var HTMLPopupContainer = document.querySelector("#add-scene-popup")


    }
    function changeSelectedScene(element)
    {
        sceneManager.changeSelectedScene(element.innerText)
        changeSelection('selected', element, 'scene')

    }






// Frontend tools
function updateSceneRaw()
{
    raw.innerText = getSceneRaw();
}
function setVisible(element)
{
    element.classList.add("visible");
}
function setInvisible(element)
{
    element.classList.remove("visible")
}

function isVisible(element)
{
    return element.classList.contains("visible");
}

function changeVisibility(element){
    element.classList.toggle("visible")
}








// Backend
function changeOption(option)
{

switch(option)
{
    case "showGrid"             : switches.showGrid             = !switches.showGrid;               break;
    case "lockGrid"             : switches.lockGrid             = !switches.lockGrid;               break;
    case "showScreenBlueprint"  : switches.showScreenBlueprint  = !switches.showScreenBlueprint;    break;
    case "showCoordinates"      : switches.showCoordinates      = !switches.showCoordinates;        break;
}
}
function update()
{

    
    
    updateGraphics();
    setTimeout(update, 1000/60);
}

function createNewSceneInStack()
{
}

function loadGameEntities()
    {
        console.warn("Loading game entities...")
        fetch("../../content/gameObjects.json")
            .then((response) =>
            {
                response.json()
                .then((json) =>
                {
                    console.warn("Load complete!")
                    json.IDs.map((id) =>
                    {

                        if(typeof id.createData.texture == 'string')
                        {
                            var img = new Image
                            img.src = "../../"+id.createData.texture
                            id.createData.img  = img
                            id.createData.id   = id.id;
                            
                            entities.push(id);
                         
                        }
                    })
                    buildEntitiesList()
                })
    
            })
}
    // Requirements
    function buildEntitiesList()
{
    entities.map((entity) =>
    {

        var objsList        = document.querySelectorAll(".elements-list")[0];
        var gameObj         = document.createElement("li");
        var objImg          = document.createElement("img");  
        objImg.src          = "../../"+entity.createData.texture;
        gameObj.innerText   = entity.createData.name;
        gameObj.setAttribute("id", entity.id)
        gameObj.setAttribute("onclick", "changeSelection('selected', this, 'element')");
        gameObj.appendChild (objImg);
        objsList.appendChild(gameObj);
    })
    }
    // 

    

// Graphics 

function updateGraphics()
{
    updateHTMLCoords();
    clearScreen();
    drawGrid();
    renderScene()
    render(previewEntitiesList);
    drawCreateArea();
    drawSelection();
    drawScreenSizeBlueprint();
    drawImageBlueprint();
}

function getSceneRaw()
{   
   
    var string = sceneManager.getSelectedSceneList().map((element) => {return `[${element[2].id}, [${element[0]}, ${element[1]}], [${element[5][0]}, ${element[5][1]}], ${element[4]}]`})
    return string;
}

function copyRawToClipboard()
{
    navigator.clipboard.writeText(getSceneRaw());
}


// Graphics
function drawScreenSizeBlueprint()
{
    if(!switches.showScreenBlueprint)return;
    var lineSize = 1
    ctx.beginPath()
    ctx.rect(0, 0, 1366, 720)
    ctx.lineWidth = lineSize;
    ctx.stroke()
    ctx.closePath()
}

function drawGrid()
{
    if(!switches.showGrid)return;
    ctx.lineWidth = 0.5;

    ctx.beginPath()

    for (var i = 0; i < canvasConfig.height/canvasConfig.gridSize; i++)
    {

        ctx.moveTo(0, i*canvasConfig.gridSize)
        ctx.lineTo(canvasConfig.width, i*canvasConfig.gridSize)
    }

    for (var i = 0; i < canvasConfig.width/canvasConfig.gridSize; i++)
    {
        ctx.moveTo(i*canvasConfig.gridSize, 0)
        ctx.lineTo(i*canvasConfig.gridSize, canvasConfig.height)
    }

    ctx.stroke()
    ctx.closePath()
}

function clearScreen()
{
    ctx.fillStyle = canvasConfig.fillColor;
    ctx.beginPath()
    ctx.rect(0, 0, canvasConfig.width, canvasConfig.height)
    ctx.fill()
    ctx.closePath()
}

function drawImageBlueprint()
  {

    if(getSelectedToolId() != "pen" || !(mousePosition.mouseover) || !isElementSelected()) return;

    var element   = getObjectById(entities, getSelectedElementId()); element = element.createData;
    var img = new Image; img.src = selected.element.children[0].src

    var position = [canvasConfig.getGriddedPosition(mousePosition.x - element.size[0]/2)+origin.x, canvasConfig.getGriddedPosition(mousePosition.y-element.size[0]/2)+origin.y]


    ctx.beginPath()
    ctx.drawImage(img, position[0], position[1], element.size[0], element.size[1])
    ctx.fillStyle = "red";
    ctx.fill()
    ctx.closePath()
}

function drawCreateArea()
{
    if(getSelectedToolId() != 'create' || !wasCreating()) return

    var firstPos=
    {
        x: createElements.firstPos[0],
        y: createElements.firstPos[1]
    };
    var lastPos = 
    {
        x: createElements.lastPos[0],
        y: createElements.lastPos[1]
    }
    ctx.beginPath()
    ctx.rect(firstPos.x+origin.x, firstPos.y+origin.y, lastPos.x - firstPos.x, lastPos.y - firstPos.y)
    ctx.lineWidth = 5;
    ctx.strokeStyle = 
    ctx.stroke()
    ctx.closePath()

}

function render(list)
{
    renderQueue = sortByIndex(list, 4);   
    renderQueue.map((entity) =>
    {
        ctx.beginPath();
        ctx.drawImage(entity[2].img, entity[0]+origin.x, entity[1]+origin.y, entity[5][0], entity[5][1]);
        ctx.closePath();
    })
}
    // Dependencies
    function renderScene()
    {
        render(sceneManager.getSelectedSceneList());
    }
    // 


function drawSelection()
{

    if (selectedObject == null)return
    buildSelectionDots();

    dotsize     = selection.dotSize;
    lineColor   = selection.lineColor;
    rect        = selection.rect;
    rectLineSize= selection.rectLineSize;

    ctx.beginPath()
    ctx.rect(rect[0], rect[1], rect[2], rect[3])
    ctx.strokeStyle = lineColor
    ctx.lineWidth = rectLineSize;
  

    up1 = selection.upDots[0];middle1 = selection.middleDots[0];down1 = selection.downDots[0]
    up2 = selection.upDots[1];middle2 = selection.middleDots[1];down2 = selection.downDots[1]
    up3 = selection.upDots[2];middle3 = selection.middleDots[2];down3 = selection.downDots[2]


    // up
    ctx.rect(up1[0], up1[1], up1[2], up1[3])
    ctx.rect(up2[0], up2[1], up2[2], up2[3])
    ctx.rect(up3[0], up3[1], up3[2], up3[3])
    // middle
    ctx.rect(middle1[0], middle1[1], middle1[2], middle1[3])
    ctx.rect(middle2[0], middle2[1], middle2[2], middle2[3])
    ctx.rect(middle3[0], middle3[1], middle3[2], middle3[3])
    
    // down
    ctx.rect(down1[0], down1[1], down1[2], down1[3])
    ctx.rect(down2[0], down2[1], down2[2], down2[3])
    ctx.rect(down3[0], down3[1], down3[2], down3[3])

    // center
    ctx.lineWidth = selection.lineSize;
    ctx.stroke()
    ctx.closePath()


}

    // Dependencies
    function buildSelectionDots()
    {
        var object = selectedObject;
        
        var x       = object[0]+origin.x;
        var y      = object[1]+origin.y;
        var width   = object[5][0] ;
        var height  = object[5][1] ;
        
        selection.dotSize = 8;
        dotsize = (width/100*10 + height/100*10)/2;
        lineSize = (width/100*20 + height/100*20)/2
        if(dotsize<10)dotsize = 10;
        if(dotsize>70)dotsize = 50;
        
        if(dotsize>= width/4) dotsize = width/4
        if(dotsize>= height/4) dotsize = height/4
        selection.dotSize = dotsize;
        // rect

        selection.rect = [x+dotsize/2, y+dotsize/2, width-dotsize, height-dotsize];

        // upDots
        selection.upDots[0]     = [x, y, dotsize, dotsize]
        selection.upDots[1]     = [x+(width/2)-dotsize/2, y, dotsize, dotsize]
        selection.upDots[2]     = [x+width-dotsize, y, dotsize, dotsize]
        // middleDots
        selection.middleDots[0] = [x, y+(height/2)-dotsize/2, dotsize, dotsize]
        selection.middleDots[1] = [x+(width/2)-dotsize/2, y+height/2-dotsize/2, dotsize, dotsize]
        selection.middleDots[2] = [x+width-dotsize, y+(height/2)-dotsize/2, dotsize, dotsize]
        // downDots
        selection.downDots[0]   = [x, y+height-dotsize, dotsize, dotsize]
        selection.downDots[1]   = [x+(width/2)-dotsize/2, y+height-dotsize, dotsize, dotsize]
        selection.downDots[2]   = [x+width-dotsize, y+height-dotsize, dotsize, dotsize]
        
        return isValid(object);
    }

// utils
function getMousePos(canvas, evt) {

    var rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
    
    return {
        x: (evt.clientX - rect.left) * scaleX-origin.x,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY-origin.y    // been adjusted to be relative to element
    }
}
    // Dependencies
    function setMousePositionInCanvas(event)
    {
        var pos = getMousePos(canvas, event)
        
        if(event)
        if (typeof pos.x != "boolean"){mousePosition.x = pos.x}
        if (typeof pos.y != "boolean"){mousePosition.y = pos.y}
    }
    function changeMouseDragState(event)
    {
        mousePosition.isDragging = changePressedState(event);
    
    }
    function mousePositionEvent(event)
    {
        switch(event)
        {
            case 'leave': mousePosition.mouseover = false;  break;
            case 'enter': mousePosition.mouseover = true;   break;
        }
    }
    // 

    // Search tools



    // Sort tools
    function sortByProperty
(
    list,
    property
) 
{
    var newList     = []
    var finalList   = []
    list.map((element) =>
    {
        newList.push([element[2][property], element])
    })
    newList = newList.sort();
    newList.map((element) =>
    {
        finalList.push(element[1])
    });
    
    return finalList
    }
    function sortByIndex(list, index) 
    {
    var newList     = []
    var finalList   = []

    list.map((element) =>
    {
        newList.push([element[index], element])
    })
    newList = newList.sort();
    newList.map((element) =>
    {
        finalList.push(element[1])
    });
    
    return finalList
    }

    // Filter tools
    function getObjectById(list, id)
{
    return getObject(list, "id", id)
    }
    function getObject(list, property, value)
{
    var returnment = false;
    list.map((element) =>
    {
        if(element[property] == value)
        {
            returnment = element;
            return element
        }
    })
    return returnment;
    }
    function isMouseBetweenPosition(x1, x2, y1, y2)
    {  
        mouse = mousePosition;
 
        return mouse.x > x1 && mouse.x < x2&& mouse.y> y1 && mouse.y < y2
    }
    function getObjectInPosition(mouse)
{
    var returnment  = false;
    elementsList = sortByIndex(sceneManager.getSelectedSceneList(), 4)
    elementsList.map((element) =>
    {
        var entity = element
        if
        (
            mouse.x > element[0]&&
            mouse.x < element[0] + entity[5][0]&&
            mouse.y > element[1]&&
            mouse.y < element[1] + entity[5][1]
        )
        {
            returnment = element;
            return
        }
        
    })
    return returnment;
    }
    function getIndexOfElementInList(list, value, properties)
    {
        if(properties != undefined)
        {

            var index = list.findIndex(element => element[properties] == value);
        }
        else
        {
            var index = list.findIndex(element => element == value);

        }

        return index;
    }

function getUID(){
    return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

    // Manipulate lists
function concatElementInList(list, element)
{
    var newList = list.concat(element);

    return newList;
}
function insertElementAtList(list, element)
{
    var newList = concatElementInList(list, element);
    list = newList;
    return newList;
}

    // Validate
function isValid(element)
{

    return (
        element != null &&
        element != -1 && 
        element != undefined
        )
}

function isStringValid(string)
{
    return string.length>2 && string.match(/^[0-9a-z]+$/) && string.length<12
}
function inputValid(element){
    return (isStringValid(element.value))
}
function resetInput(element)
{
    element.value = '';
}
function isSelected(name){
        return (selected[name]!= null && selected[name] != undefined)
}

function changeSelection
(
name,
element,
variableName
)
{

    selectedObject = null;

    var els = Array.from(element.parentNode.getElementsByClassName(name))

    els.map((element) =>
    {
        element.classList.remove(name)
    })
    element.classList.add(name)
    selected[variableName] = element


}
function createNewElement(x, y, createData)
{

    return newElement = [x, y, createData, getUID(), createData.renderIndex,createData.size.slice(0, 2)]

}

function changePressedState(mouseEvent)
{
    switch(mouseEvent.type)
    {
            case "mousedown":
                return true;
            break;
            
            case "mouseup":
                return false;
            break;
            }

        }










// Tools
function performToolAction()
{
    onToolAction();

    if (!isToolSelected()) return;
    switch (getSelectedToolId())
    {
        case "pen":
            putElement();
        break;
    
        case "eraser":
            deleteElement();
        break;
    
        case "move":
            moveElement()
        break;
    
    }    
}


function putElement()
{

    if(!isElementSelected()) return
    if(getSelectedToolId() != "pen")return
    var cdata = getObjectById(entities, getSelectedElementId());
    element = cdata.createData;
    var pos = [canvasConfig.getGriddedPosition(mousePosition.x-element.size[0]/2), canvasConfig.getGriddedPosition(mousePosition.y-element.size[1]/2)]

    sceneManager.insertElementInScene(sceneManager.getSelectedScene(), createNewElement(pos[0], pos[1], element));



}
    // Dependencies

    // 


function startCreatingElements()
{

    if(getSelectedToolId() == 'create' && isElementSelected())
    {
        createElements.firstPos = [canvasConfig.getGriddedPosition(mousePosition.x), canvasConfig.getGriddedPosition(mousePosition.y)]
        createElements.lastPos = [mousePosition.x, mousePosition.y]
    }
}
    // Dependencies
    function wasCreating()
    {

        return (mousePosition.isDragging == true && getSelectedToolId() == "create")
    }
    function hasElementsToInsert()
    {
        return previewEntitiesList.length>0 ;
    }
    function insertCreatedEntitiesInGame()
    {

        if(!wasCreating() || !hasElementsToInsert())return;
        sceneManager.concatArrayInScene(sceneManager.getSelectedScene(), previewEntitiesList)
        previewListReset();
}
    function previewListReset()
    {
        previewEntitiesList = [];

    }
    function setFillElementsLastPosition()
{
    if(wasCreating())
    {
        if(!isElementSelected()) return;
        generateCreationPreview();
        createElements.lastPos = [mousePosition.x, mousePosition.y]
    }
    }
    function generateCreationPreview()
    {

        if(!isElementSelected())return;
        var list = []


        var entitySelected = getObjectById(entities, getSelectedElementId()).createData;
        var size = [entitySelected.size[0], entitySelected.size[1]]
        
        var lastPos  = [createElements.lastPos[0], createElements.lastPos[1]]
        var firstPos  = [createElements.firstPos[0], createElements.firstPos[1]]
        
        var horizontal = Math.floor((lastPos[0] - firstPos[0]) / size[0]);
        var vertical =  Math.floor((lastPos[1] - firstPos[1])/ size[1]);
        for (var i = 0; i<vertical; i++)
        {

            for(var j = 0; j<horizontal; j++)
            {
                list.push(createNewElement(firstPos[0]+j*size[0], firstPos[1]+i*size[1], entitySelected))
            }
        }

        previewEntitiesList = list;
    }
    // 


function moveElement()
{


    var object   = getObjectInPosition(mousePosition)
    if (!object)return;
    selectedObject = sceneManager.getSelectedSceneList()[getIndexOfElementInList(sceneManager.getSelectedSceneList(), object[3], 3)];


    



}

    // Dependencies
    function mouseIsInsideSelectedObject()
    {
        return getObjectInPosition(mousePosition) == selectedObject;
    }
    function verifyIfSelectedToMoveOnMouseDown()
    {
        if(selectedObject != null && mouseIsInsideSelectedObject()) changeMovingElementState(null, true);
        
    }
    function wasMoving()
    {
        return mousePosition.isDragging === true && switches.moving;
    }

    function isMouseOnDot(name, index)
    {
        return isMouseBetweenPosition
        (   
            selection[name][index][0]-origin.x,
            selection[name][index][0]+selection.dotSize-origin.x,            
            selection[name][index][1]-origin.y,
            selection[name][index][1]+selection.dotSize-origin.y,
        )
    }
    function getPressedDot()
    {
        var returnment      = false;
        var dotNamesArray   = ["upDots", "middleDots", "downDots"];
        var indexes         = [0, 1, 2];

        
        dotNamesArray.map((name) =>
        {
            indexes.map((index) =>
            {
                if (isMouseOnDot(name, index))
                {
        
                    returnment = {name, index}
                    return;
                }
            })
        })
        
        return returnment;
    }

    function selectAction(pressedDot)
    {
        switches.movingAction = 'move';
        switch(pressedDot.name)
        {
            case 'upDots':
                if(pressedDot.index == 1)
                {
                    switches.movingAction = 'height';
                }
                else
                {
                    switches.movingAction = 'scale'
                } 
            case 'downDots':
                if(pressedDot.index == 1)
                {
                    switches.movingAction = 'height';
                }
                else
                {
                    switches.movingAction = 'scale'
                }

            break;

            case 'middleDots':
                if(pressedDot.index == 1)
                {
                    switches.movingAction = 'move';
                }
                else
                {
                    switches.movingAction = 'width'
                }
            break;

        }
    }
    function MoveSelectedElement()
    {

        if(wasMoving() && getSelectedToolId() == "move" && selectedObject != null)
        {
            var pressedDot = getPressedDot();

            switch (switches.movingAction)
            {
                case'move':
                    if (!switches.distanceSet)
                    {
                        distancex = mousePosition.x - selectedObject[0]
                        distancey = mousePosition.y - selectedObject[1]
                        switches.distanceSet = true;
                    }
                    
                    selectedObject[1] = canvasConfig.getGriddedPosition(mousePosition.y - distancey)
                    selectedObject[0] = canvasConfig.getGriddedPosition(mousePosition.x - distancex);
                break;
                
                case 'scale':
                    selectedObject[5][0] = canvasConfig.getGriddedPosition(mousePosition.x-selectedObject[0]);
                    selectedObject[5][1] = canvasConfig.getGriddedPosition(mousePosition.y-selectedObject[1]);
                break;
                case 'width':
                    
                    selectedObject[5][0] = canvasConfig.getGriddedPosition(mousePosition.x-selectedObject[0]);
                break;

                case 'height':
                    selectedObject[5][1] = canvasConfig.getGriddedPosition(mousePosition.y-selectedObject[1])
                break;
                case null:
                    selectAction(pressedDot);
                break;
            }






        }
    }
    function changeMovingElementState(event, bool)
    {
        if (isValid(bool))
        {
            switches.movingAction = null;
            switches.moving = bool;
            switches.distanceSet = false;
            return;
        }

        switches.moving = changePressedState(event);


    }
    // 

function deleteElement()
{
    var objsList = sceneManager.getSelectedSceneList();
    var object      = getObjectInPosition(mousePosition)
    var objectIndex = getIndexOfElementInList(sceneManager.getSelectedSceneList(), object[3], 3)
    if (!object)return;
    updateActionsHistory(sceneManager.getSelectedSceneList());
    sceneManager.getSelectedSceneList().splice(objectIndex, 1)
}

function redo()
{
    changeHistory(+1);
}
function undo()
{

    changeHistory(-1);

}
    // Dependencies

    function updateActionsHistory(list)
    {
        actionsHistory.push([...list]);
        maxUndoIndex = actionsHistory.length-1
        undoIndex = maxUndoIndex;
    }

    function changeHistory(index)
    {

        if (index<0 && undoIndex-1<0)return;
        if (index>0 && undoIndex+1>=actionsHistory.length)return;
        undoIndex+=index;
        refreshScene();
        return true;
        
    }
    function refreshScene()
    {

        sceneManager.replaceSelectedSceneList(actionsHistory[undoIndex])
    }
    // 

function layerUp()
{

    if (selectedObject == null || getSelectedToolId() != "move") return;
    selectedObject[4]++;  
}

function layerDown()
{

    if (selectedObject == null || getSelectedToolId() != "move"|| selectedObject[3] <= 0) return;
    
    selectedObject[4]--;

}












// Events handler
    // GameEvents
    function onToolAction()
    {   
        selectedObject = null;
    }




    // Input events
    function onMouseDown(event)
    {
        if(event.button == 1)
        {
            switches.middleButtonDown = true;
            originData.startPosition.x = mousePosition.x;
            originData.startPosition.y = mousePosition.y;
        }
        verifyIfSelectedToMoveOnMouseDown()
        changeMouseDragState(event);
        startCreatingElements();
    }

    function onMouseUp(event)
    {
        if(event.button == 1)
        {
            switches.middleButtonDown = false;
        }
        insertCreatedEntitiesInGame() // !!! it should be in the top of it!!!
        changeMouseDragState(event);
        changeMovingElementState(null, false);
    }
    function onMouseMove(event)
    {
       
        if(switches.middleButtonDown)
        {
            var distancex = originData.startPosition.x - mousePosition.x;
            var distancey = originData.startPosition.y - mousePosition.y;
    
            var originDirection = {x: distancex / Math.abs(distancex), y: distancey / Math.abs(distancey)}
            if(originDirection.x != 1 && originDirection.x != -1) originDirection.x = 0;
            if(originDirection.y != 1 && originDirection.y != -1) originDirection.y = 0;
            
            origin.x -= distancex;
            origin.y -= distancey ;
    

    
        }
        setMousePositionInCanvas(event);
        setFillElementsLastPosition();
        MoveSelectedElement();
    
    }
    function onMouseClick(event)
    {

        performToolAction()

    }
    function onMouseLeaveCanvas()
    {
        mousePositionEvent('leave');
    }
    function onMouseEnterCanvas()
    {
        mousePositionEvent('enter');
    }
    function onWindowResize()
    {
        resizeCanvas()
    }
    function onWheel(event)
    {
        var orientation = event.deltaY/Math.abs(event.deltaY);
        var maxZoom     = canvasConfig.maxZoom;
        var minZoom     = canvasConfig.minZoom;
        var scale       = canvasConfig.scale;
        var zoomSpeed   = canvasConfig.zoomSpeed;
        console.log(scale)
        if((scale-zoomSpeed < minZoom && orientation<0)|| (scale+zoomSpeed > maxZoom && orientation>0))return
        canvasConfig.scale += zoomSpeed*orientation;
        resizeCanvas()
    }

    // 
function inputManager(event)
{
// special function :)
updateSceneRaw();

switch
(event.type)

{
    case "mousedown"    :   onMouseDown         (event);    break;
    case "mouseup"      :   onMouseUp           (event);    break;
    case "mousemove"    :   onMouseMove         (event);    break;
    case "click"        :   onMouseClick        (event);    break;
    case "mouseleave"   :   onMouseLeaveCanvas  (event);    break;
    case "mouseenter"   :   onMouseEnterCanvas  (event);    break;
    case "resize"       :   onWindowResize      (event);    break;
    case "wheel"        :   onWheel             (event);    break;
}
}
function setUpEvents()
{
    window.addEventListener('mousedown' , inputManager);
    window.addEventListener('mouseup'   , inputManager);
    window.addEventListener('mousemove' , inputManager);
    canvas.addEventListener('click'     , inputManager);
    window.addEventListener('resize'    , inputManager);
    canvas.addEventListener('mouseleave', inputManager);
    canvas.addEventListener('mouseenter', inputManager);
    canvas.addEventListener('wheel'     , inputManager);

}
function setUpCanvasMainSettings()
{
    resizeCanvas();
    ctx.lineWidth   = canvasConfig.lineSize;
}
function resizeCanvas()
{
    canvas.style.zoom = "100%";
    var canvasSize = canvas.getClientRects()[0];
    var scale = canvasSize.height/canvasSize.width;
    var multiplier = canvasConfig.scale;
    
    canvasConfig.width = canvasSize.width*multiplier;
    canvasConfig.height = canvasSize.width*scale*multiplier;

    canvas.width    = canvasConfig.width;
    canvas.height   = canvasConfig.height;
}
function main()
{
    setUpEvents();
    setUpCanvasMainSettings();
    loadGameEntities();
    updateHTMLScenesList();
    update();
}

document.onload = main()
