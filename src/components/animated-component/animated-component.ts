import { Component, Input } from '@angular/core';
import { trigger,
  state,
  style,
  animate,
  transition } from '@angular/animations'

@Component({
	selector:"animated-component",
	template: 
			`<div><ng-content></ng-content></div>`,
	animations: [
		  trigger('flyInOut', [
		    state('in', style({transform: 'translateX(0)'})),
		    transition('void => *',
		      animate('100ms ease-in')),
		    transition('* => void',
		      animate('100ms ease-out'))
		  ])
	]
})
export class AnimatedComponent{
// 	@Input()
// 	private customer;

// 	private getDefaultAvatar(member){
// 		if(member){
// 			return member.lastName.substring(0,1).toUpperCase() + member.firstName.substring(0,1).toUpperCase();
// 		}else{
// 			return "?";
// 		}
// 	}
}