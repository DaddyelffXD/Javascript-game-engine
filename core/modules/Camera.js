import { Core } from "../../main.js";


class CameraC
{
    _x          = 0;
    _y          = 0;
    _x_limit    = [0, 30000];
    _y_limit    = [0, 10000];
    _zoom_limit = [2, 0.4];
    _zoom_speed = 0.08;
    speed       = 1;
    zoom        = 1;

    getOrigin   = function ()
    {
        return {x: this._x*this.zoom, y: this._y*this.zoom};
    };
    setPos = function(x,y)
    {
        this.setX(x);
        this.setY(y);
    }
    setX = function (value)
    {
        if((this._x + value)*-1>this._x_limit[1] || (this._x + value)*-1<this._x_limit[0] || typeof value != "number") return false;
        this._setPostion("_x", value);
    };
    setY = function(value)
    {
        if((this._y + value)*-1>this._y_limit[1] || (this._y + value)*-1<this._y_limit[0] || typeof value != "number") return false;
        this._setPostion("_y", value);
    }
    _setPostion  = function(variableName, value)
    {
        this[variableName] = value;
        return
    }



    zoomIn = function()
    {
        this._changeZoom(this._zoom_speed*-1)
    }
    zoomOut = function()
    {
        this._changeZoom(this._zoom_speed)
    }
    _changeZoom = function(value)
    {
        if(this.zoom + value>this._zoom_limit[0] || this.zoom+value<this._zoom_limit[1])return;
        this.zoom+=value;
    }




}
export const Camera = new CameraC;