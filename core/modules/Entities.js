import {Vector2, UID} from "./Utils.js"
import { Search } from "./Utils.js"
import { GameElementIDs } from "./GameElements.js"

export class Entities
{

    static getEntityInPosition = function(x, y)
    {
        var list = Entities.list.map((obj) => {
            return  [
                    
                    obj.position[0], obj.position[0]+obj.size[0],
                    obj.position[1], obj.position[1]+obj.size[1] 
                
                    ]})

        return Search.getNumberBetweenInList(x, y, list)
    }
    static NewEntityById = function(id)
    {
        // search entity by id gived in function argument that will be verified down below
        var entityFoundById                 = Search.returnObject(GameElementIDs.IDsList, id, "id");
        
        // check if entity waf found, otherwise cancel entity creation
        if (!entityFoundById)
        {

            console.warn("entidade com id "+ id + " não encontrada!"); return false;

        }
        
        var propertiesValues                = Object.values (entityFoundById.createData);
        var propertiesNames                 = Object.keys   (entityFoundById.createData);    
        var entityCreationArgumentsArray    = []; 

        for(var i=0; i<propertiesValues.length;i++)
        {

            entityCreationArgumentsArray.push({propertyName: propertiesNames[i], propertyValue: propertiesValues[i]})

        }


        var entity = new Entities(entityCreationArgumentsArray);
    
        return entity;

    }


     constructor(...argument)
     {

        var creationArguments = arguments[0]
        // check if there's some argument
        if(arguments.length<=0)return;
        // here, the arguments should be of the type object, wich will provide the name and value of argument, for all the arguments
        // now, we're looping thorught arguments list and setting each argument and value to the object
    

        var argsRequirements = GameElementIDs.RequirementList;

        creationArguments.map((argument) =>
        {

            var propertyName    = argument.propertyName;
            var propertyValue   = argument.propertyValue;
            this[propertyName]  = propertyValue;

            if(!(typeof argument == 'object') &&!(typeof argument.name == 'string')) return;
            if(argument.propertyName == "texture")
            {

                var texture = new Image()
                texture.width = 32
                texture.height = 32
                texture.src = argument.propertyValue
                this.texture = texture;

            }

            argsRequirements.map((requirement, i ) =>
            {
                if (requirement.name == propertyName)
                {
                    requirement.arguments.map((arg) =>
                    {
                        var name    = arg.name;
                        var value   = arg.default;

                        this[name] = value;     
                    })
                }
                
            })


            

        })

        this.ID = UID.generate(Entities.list, 5)

       

        Entities.list.push(this)

     }

     static getEntityById = function(id)
     {
        var entity  = null;
        var index   = null;

        Entities.list.map((element, i) => 
        {
            if (element.ID == id)
            {
                entity = element;
                index  = i;
                return;
            }
        })

        return {entity, index};
     }

     static list = [];

     static reset = function()
     {
        Entities.list = [];
     }
}


// uma entidade sera tudo que existe no jogo, exceto o mapa, inimigos, particulas, elementos da GUI, construções, tudo.
// as entidades terão propriedades definidas como: visível, físico, ativado, dinamico/estatico, animado, cada uma com os seus devidos argumentos requeridos.
// 
// cada entidade vai ter um id unico e classe
// na classe vai existir uma lista com todas as entidades
// operaçoes basicas com as entidades: remover, adicionar