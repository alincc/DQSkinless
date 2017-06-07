import { Component, Input } from '@angular/core';

@Component({
	selector: 'content-with-loading',
	template:
	`<div class="content-with-loading">
		<ng-content *ngIf="!isLoading"></ng-content>
		<div class="cssload-loader" *ngIf="isLoading">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div>`
})
export class ContentWithLoading{
	@Input()
	isLoading : boolean;
}