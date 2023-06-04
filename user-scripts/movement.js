import { Core } from "../../main.js"
import { Camera } from "../core/modules/Camera.js";
import { Graphics } from "../core/modules/Graphics.js";
import { zombie } from "./main.js"

var selectedObjectId = null;

function update()
{
    playerMovement();
    cameraMovement();
    drawBlueprint();
    
}

function drawBlueprint()
{
    if(typeof selectedObjectId != "number" ) return;
    var object = Core.Entities.getEntityById(selectedObjectId).entity
    Core.Graphics.canvas.beginPath()

    Core.Graphics.canvas.rect(object.position[0]*Core.Camera.zoom, object.position[1]*Core.Camera.zoom , object.size[0]*Core.Camera.zoom, object.size[1]*Core.Camera.zoom);
    Core.Graphics.canvas.lineWidth = 3
    Core.Graphics.canvas.stroke();

}

function cameraMovement()
{
    Core.Camera.setX(zombie.position[0]*-1+(Core.Graphics.width/2));
    Core.Camera.setY(zombie.position[1]*-1+(Core.Graphics.height/2));
};

function playerMovement()
{
    if(Core.InputManager.UP)
    {
        zombie.position[1]-= zombie.speed;
    }
    if(Core.InputManager.DOWN)
    {
        zombie.position[1]+= zombie.speed;
    }
    if(Core.InputManager.LEFT)
    {
        zombie.position[0]-= zombie.speed;
    }
    if(Core.InputManager.RIGHT)
    {
        zombie.position[0]+= zombie.speed;
    }


}

function changeCameraZoom(event)
{
    switch(event.deltaY/100)
    {
        case 1:
            Core.Camera.zoomIn();
        break;

        case -1:
            Core.Camera.zoomOut();
        break;
    }
}

function selectObjByClick(e)
{
    // Core.Entities.getEntityInPosition(e.x, e.y);
    var click = Core.Graphics.getPositionInCanvas(e)


    
    var selectedEntityPos = Core.Entities.getEntityInPosition(click.x, click.y);
    var selectedEntity = Core.Entities.list[selectedEntityPos]
    selectedObjectId = selectedEntity.ID;

}

Core.Events.addEventListener("onUpdate", update)
Core.Events.addEventListener("onMouseWheel", changeCameraZoom);
Core.Events.addEventListener("onMouseUp", selectObjByClick)