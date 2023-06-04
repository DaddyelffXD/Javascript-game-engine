import { TiledWorld } from "./core/modules/TiledWorldManager.js";
import { Camera } from "./core/modules/Camera.js";
import {InputManager} from "./core/modules/InputManager.js";
import { Entities, Entities as Entity} from "./core/modules/Entities.js";
import { Graphics } from "./core/modules/Graphics.js";
import { Search } from "./core/modules/Utils.js";
import { Renderer } from "./core/modules/Renderer.js";
import { GameElementIDs } from "./core/modules/GameElements.js";
import { Event} from "./core/modules/Events.js";
import { LoadGameCode } from "./core/modules/ScriptLoader.js";
import { UID } from "./core/modules/Utils.js";

export class Core
{
    
    static init = 
    function()
    {
        this.setupCoreEvents();
        this.load();

    }
    static setupModules =
    function()
    {
        Core.TiledWorldManager = TiledWorld;
        Core.GameComponentsId = GameElementIDs;
        Core.InputManager = InputManager;
        Core.Events = Event;
        Core.Entities = Entities;
        Core.Camera = Camera;
        Core.Graphics = Graphics;
        Core.Utils = {ID: UID, Search: Search};
        return true;
    }

    static start = function()
    {
        Core.setupModules();
        LoadGameCode.loadUserScripts()
        TiledWorld.load();
        Event.onStart();
    }
    static update = 
    function()
    {
        Graphics.update();
        Renderer.render();
        Event.onUpdate();

        setTimeout(Core.update, 1000/60)
    }
    static settings =
    {
        MAIN_SCENE: "scene_1",
        BACKGROUND_COLOR: "aquamarine"
    }

    static setupCoreEvents = 
    function()
    {
        // setting the main game events
        Event.addEvent("onStart");
        Event.addEvent("onUpdate");
        Event.addEvent("onModulesLoad");
        Event.addEvent("onScriptLoad");
        Event.addEvent("onCoreLoad");
        Event.addEvent("onKeyUp");
        Event.addEvent("onKeyDown");
        Event.addEvent("onMouseUp");
        Event.addEvent("onMouseDown");
        Event.addEvent("onMouseWheel");

        // adding init based on load of modules
        Event.addEventListener("onCoreLoad", Core.start);
        Event.addEventListener("onScriptLoad", function(s){console.log("New user script loaded: "+s)});
        Event.addEventListener("onStart", Core.update);
        Event.addEventListener("onModulesLoad", Event.onStart);
    }
    
    static load = 
    function()
    {
        console.warn("Loading game...");
        try{var loaded = [TiledWorld, InputManager, GameElementIDs, LoadGameCode]}catch(e){setTimeout(Core.load, 100);return;}
        if(TiledWorld.isLoaded() && InputManager.isLoaded()&&GameElementIDs.isLoaded() && LoadGameCode.isLoaded()){}else{setTimeout(Core.load, 1);return};
        console.warn("Game loaded sucesfully!")
        Event.onCoreLoad(12);
    }
}

document.onload = Core.init();
