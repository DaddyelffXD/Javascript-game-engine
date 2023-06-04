import { Core } from "../../main.js";

class Events
{
    buffers = {}

    addEvent = function(name)
    {

        Event.buffers[name] = [];

        Event[name] = function(...args){Event.buffers[name].map((func) => 
        {
            try
            {
                func(...args);
            }
            catch(err)
            {
                return console.warn(err)
            }

        
        });}

    }

    addEventListener = function(name, func)
    {
        if (Event.buffers[name] == undefined) return;
        Event.buffers[name].push(func);
    }
    getGameEvents = function()
    {
        var events = ""
        events += Object.keys(Event.buffers).map((event) => {return event});
        return events;
    }
}

export const Event = new Events
