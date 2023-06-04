import { Core } from "../../main.js"

class LoadGameCodeC
{
    scripts = [];
    loaded = false;
    constructor()
    {
        fetch("./content/UserScripts.json")
        .then((response) =>
        {
            response.json()
                .then((element) =>
                {
                    element.scripts.map((script) =>
                    {
                        this.scripts.push({"name":script.name, "path": script.path});
                    })

                })
        })

    }
    isLoaded = function()
    {

        return this.scripts.length > 0;
    }


    loadUserScripts = function()
    {
        this.scripts.map((element) =>
        {
            const script = document.createElement("script");
            script.setAttribute('type', 'module')
            script.src = "user-scripts/"+element.path+element.name+".js";
            document.head.appendChild(script)
            Core.Events.onScriptLoad(element.name);
        })

    }

}

export const LoadGameCode = new LoadGameCodeC;