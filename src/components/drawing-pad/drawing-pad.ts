import { Component, ViewChild } from '@angular/core';
import { CanvasWhiteboardComponent } from 'ng2-canvas-whiteboard';

@Component({
	selector:"drawing-pad",
	templateUrl: "drawing-pad.html",
	providers:[ CanvasWhiteboardComponent ]
})
export class DrawingPad{

	private coords : any[] = [];
	private _pendown = false;

	public pendown(e){
		console.log("pendown");
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		this._pendown = true;
		this.write(mouseX, mouseY,e);
		// redraw();
	}

	private write(x,y,e){
		let context = e.target.getContext("2d");
		context.strokeStyle = "#df4b26";
		context.lineJoin = "round";
		context.lineWidth = 5;

		if(this.coords.length){
			let lastCoords = this.coords[this.coords.length-1];
			context.moveTo(lastCoords.x,lastCoords.y);
			context.lineTo(x,y);
		}else{
			context.moveTo(x,y);
		}

		context.closePath();
		context.stroke();
		this.coords.push({x:x, y:y});
	}

	public pendrag(e){
		e.preventDefault();
		console.log("drag");
		if(this._pendown){
			this.write(e.pageX, e.pageY,e);
		}
	}

	public penup(e){
		console.log("up");
		this._pendown = false;
	}


}