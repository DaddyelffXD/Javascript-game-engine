class GraphicsC
{
    constructor()
    {

        this.canvasHTML         = document.createElement("canvas");
        this.canvasHTML.id      = 'canvas';
        this.canvasHTML.style   = "width: 100%; height: 100%; background-color: whitesmoke";
        this.defaultColor       = 'green';
        this.width              = 1280;
        this.height             = 720;
        this.canvasHTML.height  = this.height;
        this.canvasHTML.width   = this.width;
        this.canvas             = this.canvasHTML.getContext('2d');
        this.canvas.imageSmoothingQuality = "high"
        document.body.appendChild(this.canvasHTML);
    }

    getPositionInCanvas(evt)
    {
            var canvas = this.canvasHTML
            
            var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
            return {
                x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
              y: (evt.clientY - rect.top) * scaleY    // been adjusted to be relative to element
            }
    }
    

    update      = function()
    {
        this.canvas.beginPath();
        this.canvas.fillStyle = "white";
        this.canvas.fillRect(0,0,this.width, this.height);
        this.resetColor();
        this.canvas.closePath()
    }
    resetColor = function()
    {
        this.canvas.fillStyle = this.defaultColor;
    }
    drawSquare = function(color, x, y, w, h)
    {
        this.canvas.beginPath();
        this.canvas.fillStyle = color;
        this.canvas.fillRect(x,y,w,h);
        this.resetColor();
        this.canvas.closePath();
    }
    drawCircle = function(color, x, y, r)
    {
        this.canvas.beginPath();
        this.canvas.fillStyle = color;
        this.canvas.arc(x, y, r, 0, 2 * Math.PI);
        this.canvas.fill();
        this.canvas.closePath();
        this.resetColor();
    }
    drawTexture = function(texture, x, y, w, h)
    {

            Graphics.canvas.drawImage(texture, x, y, w, h)

    }
}
const Graphics = new GraphicsC;

export {Graphics};
