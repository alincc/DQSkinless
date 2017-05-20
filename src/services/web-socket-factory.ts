import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client/dist/sockjs';
import { Endpoint } from '../config/endpoint';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class WebSocketFactory {

	public connect(url: String): any {
		var sock = new SockJS(Endpoint.environment + url, null);
		var connection: any = new Observable(publisher => {

			sock.onmessage = response => {
				publisher.next(response.data);
			}
			sock.onclose = err => {
				publisher.error(err);
			}
		});

		return {
			send: (message) => { sock.send(message) },
			connection: connection,
			then: (callback) => {
				sock.onopen = response => {
					callback(response)
				}
			},
			close: () => { sock.close(); }
		};
	}
}