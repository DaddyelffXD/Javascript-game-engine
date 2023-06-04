import { Sort } from "./Utils.js"
import { Entities } from "./Entities.js"
import { Camera } from "./Camera.js"
import { Graphics } from "./Graphics.js"
import { Core } from "../../main.js"

class RendererC
{
    render = function()
    {
    
        var renderList = Sort.sortByProperty(Entities.list, "renderIndex")
        renderList.map((entity) => 
        {
            var x       = entity.position[0]*Core.Camera.zoom+Camera.getOrigin().x;
            var y       = entity.position[1]*Core.Camera.zoom+Camera.getOrigin().y;
            var width   = entity.size[0]*Core.Camera.zoom;
            var height  = entity.size[1]*Core.Camera.zoom;

            if (entity.visible)
            {
                if(entity.hasTexture)
                {
                    var texture = entity.texture;
                    Graphics.drawTexture(texture, x, y, width, height)
                }
                else
                {
                    var texture = entity.color;
                    Graphics.drawTexture(texture, x, y, width, height)
                }
            }
        })
    }

}

export const Renderer = new RendererC;