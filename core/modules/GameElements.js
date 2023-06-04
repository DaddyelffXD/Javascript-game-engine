class GameElementIDsC
{

    constructor()
    {
        fetch("./content/gameObjects.json")
            .then((response) =>
            {
                response.json()
                    .then((data) =>
                    {
                        data.RequiredParameters.map((parameter) => 
                        {
    
                            this.RequirementList.push(parameter)
                        })
                        data.IDs.map((id) =>
                        {

                            this.IDsList.push(id)
                        })

                        
                    })
                })


    }


    
    isLoaded = function(){return (this.IDsList.length > 0)}




    IDsList         = []
    RequirementList = []
}

export var GameElementIDs = new GameElementIDsC