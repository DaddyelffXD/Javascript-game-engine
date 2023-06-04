class Vector2
{
    constructor
    (
        x,
        y,
        list
    )
    {
        if(list==undefined)
        {
            this.x = x;
            this.y = y;
        }
        else if(typeof list == "object" && !(list.length<2))
        {
            this.x = list[0];
            this.y = list[1];
        }
    }
}

class Search
{
    static isBetweenTwoNumbers(number, min, max)
    {
        return(number>min && number<max);
    }

    static getNumberBetweenInList(x, y, list)//the values min and max should be inside vector > [min, max]
    {
        var returnment = false;
        list.map((e, i) => {
            if(Search.isBetweenTwoNumbers(x, e[0], e[1]) && Search.isBetweenTwoNumbers(y, e[2], e[3]))
            {
                returnment = i;
                return;
            }
        })

        return returnment;
    }

    static returnObject
    (
    list,
    item,
    property
     )
    {
        var returnment = false;
        if (property == undefined)
        {
            list.map((element) => 
            {
                if(element == item)
                {
                    returnment = element;
                    return;
                }
            })
        }
        else
        {
            list.map((element) =>
            {
                if (element[property] == item)
                {
                    returnment = element;
                    return;
                }
        })

        return returnment;
    }
    }
}

class UID
{

    static getNewId = function(length)
    {
        return Math.floor(Math.pow(10, length-1) + ((Math.random()*Math.pow(10, length-1))));
    }

    static haveDuplicatedId = function
    (
    ID,
    IDList
    )
    {
        let returnment = false;
        IDList.map((element) => 
        {
            if (element == ID) returnment = true;
        })
        return returnment;
    }

    static generate = function
    (
    list,
    length
    )
    {
        do
        {
            var ID = this.getNewId(length);

        }
        while (this.haveDuplicatedId(ID, list))

        return ID;
    }
}
class Sort
{
    static sortByProperty = function(list, property) 
    {
        var newList     = []
        var finalList   = []
        list.map((element) =>
        {
            newList.push([element[property], element])
        })
        newList = newList.sort();
        newList.map((element) =>
        {
            finalList.push(element[1])
        });
        
        return finalList
    }

}

export{Sort, Vector2, UID, Search}

