import { Core } from "../../main.js"
class InputManagerC
{

    isLoaded = function(){return (this.keys.length > 0)}
    constructor()
    {

        fetch('configs/inputActions.json')
            .then((response) =>
        {
            response.json() 
                .then((configs) =>
                {
                    configs.inputActions.map((config) =>
                    {
                        this.keys.push([config.name, config.keys])
                        this[config.name] = false; 
                    })
                })

        })
    }


    //keys settings
    keys = [];

    isPressed = 
        function(key, argFunction)
        {
            this.keys.map((element) => 
            {
                element[1].map((subElement) => 
                {
                    if (subElement == key)
                    {
                        argFunction(element[0])
                    }
                })
            })
            
        }

    keyEvent = 
        function(event)
        {
            switch(event.type)
            {
                case "keydown":
                    Core.Events.onKeyDown(event.code);
                    InputManager.isPressed(event.code, function(response)
                    {
                        InputManager[response] = true;
                    })
                break;
                
                case "keyup":
                    Core.Events.onKeyUp(event.code);
                    InputManager.isPressed(event.code, function(response)
                    {
                        InputManager[response] = false;

                    })
                break;

            }

        }

    // mouse section
    onMouseDownEventBuffer = [];

    set onMouseDown(param)
    {
        InputManager.onMouseDownEventBuffer.push(param);
    }

    mouseEvent =
        function(event)
        {
          switch(event.type)
          {
            case "mouseup"  :   Core.Events.onMouseUp(event);   break;
            case "mousedown":   Core.Events.onMouseDown(event); break;
            case "wheel"    :   Core.Events.onMouseWheel(event);break;
          }
        }

};

export const InputManager = new InputManagerC;

//settings
window.addEventListener('keyup',        InputManager.keyEvent,  false);
window.addEventListener('mousedown',    InputManager.mouseEvent,false);
window.addEventListener('wheel',        InputManager.mouseEvent,false)
window.addEventListener('mouseup',      InputManager.mouseEvent,false);
window.addEventListener('keydown',      InputManager.keyEvent,  false);

