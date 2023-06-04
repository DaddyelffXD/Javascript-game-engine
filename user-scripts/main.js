import { Core } from "../../main.js"


export var zombie;
function onStart()
{
    zombie = Core.Entities.NewEntityById(0);


}


document.onload = onStart();