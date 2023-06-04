import { Core } from "../../main.js"
import { Entities } from "./Entities.js"
import { Search, Vector2 } from "./Utils.js"
import { GameElementIDs } from "./GameElements.js"


class TiledWorldC
{
    constructor()
    {
        fetch("./content/worlds.json")
            .then((response) =>
            {
                response.json()
                    .then((element) =>
                    {
                        element.scenes.map((scene) =>
                        {
                            
                            TiledWorldC.list.push(scene)

                        })

                    })
            })
    }

    isLoaded = function(){return (this.list.length > 0)}



    setScene = function(name)
    {
        var search = Search.returnObject(Scenes.list, name, "sceneName")        
        if(!search)return;
        Entities.reset();
    
        Scenes.generateScene(search.entities);
    }


    load = function(){this.setScene(Core.settings.MAIN_SCENE);}

    changeScene = function(name){this.setScene(name);}



    generateScene = function(list)
    {

        list.map((element) => 
        {   
            var id              = element[0];
            var position        = element[1];
            var size            = element[2];
            var RenderIndex     = element[3]
            var newEntity       = Entities.NewEntityById(id);
            newEntity.position  = position;
            newEntity.size      = size;
            newEntity.RenderIndex   = RenderIndex;

        })

    }



    list = [];

}

export const TiledWorld = new TiledWorldC;
