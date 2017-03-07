import { Component, ViewChild} from '@angular/core';
import { Content, ViewController, NavParams } from 'ionic-angular';
import { DIAGRAM } from '../../constants/constants';

@Component({
	selector:"drawing-pad",
	templateUrl: "drawing-pad.html",
})
export class DrawingPad{

	private coords : any;
	private _pendown = false;
	private canvas : any;
	@ViewChild('drawingPad')
	private set childDom( dom: any){
		this.canvas = dom.nativeElement;
	}
	@ViewChild(Content) content: Content;
	private context;

	ngAfterViewInit(){
		this.context = this.canvas.getContext("2d");
		let _context = this.context;
		let _content = this.content;
		let imageObj = new Image();
		imageObj.onload = function(){
			setTimeout(() => {
			_context.drawImage(imageObj,
				(_content.contentWidth - imageObj.width)/2,
				(_content.contentHeight - imageObj.height)/2);
		}, 100)
		}
		imageObj.src = DIAGRAM.assets[this.params!.data!.diagram];
	}

	constructor(
		private view: ViewController,
		private params: NavParams){

	}

	private pendown(e){
		e.preventDefault();
		console.log("pendown");
		console.log(e);;
		this._pendown = true;
		this.write(e);
	}

	private pendrag(e){
		e.preventDefault();
		if(this._pendown){
			this.write(e);
		}
	}

	private penup(e){
		console.log("up");
		this._pendown = false;
		this.coords = null;
	}

	private write(e){
		let offsetTop = this.content.contentTop;
		let _x , _y;
		if(e.touches){
			if(e.touches.length > 1){
				return;
			}
			_x = e.touches[0].clientX + (e.target.parentElement.scrollLeft || 0);
			_y = e.touches[0].clientY - (offsetTop || 0) + (e.target.parentElement.scrollTop || 0);
		}else{
			_x = e.clientX;
			_y = e.clientY - (offsetTop || 0 )+ (e.target.parentElement.scrollTop || 0);
		}
		if(this.coords){
			this.context.moveTo(this.coords.x,this.coords.y);
		}else{
			this.context.moveTo(_x-1,_y+1);
		}
		this.context.lineJoin = "round";
		this.context.lineWidth = 0.3;
		this.context.lineTo(_x,_y);
		this.context.stroke();
		this.coords = {x:_x, y:_y};
	}

	private cancel(){
		this.view.dismiss();
	}

	private save(){
		let image = this.canvas.toDataURL("image/jpg");
		this.view.dismiss(image);
	}




}