import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ArraySubject{
    private contacts : any[] = [];
    private contactsSubject : BehaviorSubject<any[]> = new BehaviorSubject(this.contacts);

    public set value( contacts : any[]){
        this.contacts = contacts;
        this.contactsSubject.next(this.contacts);
    }

    public get value() : any[]{
        return this.contacts;
    }

    public push(item){
        this.contacts.push(item);
        this.contactsSubject.next(this.contacts);
    }

    public pop(){
        this.contacts.pop();
        this.contactsSubject.next(this.contacts);
    }

    public splice(idx,count,replacement?){
        replacement ?  this.contacts.splice(idx,count,replacement) : this.contacts.splice(idx,count);
        this.contactsSubject.next(this.contacts);
    }

    public subscribe( fn ) : any{
        this.contactsSubject.subscribe(fn);
    }

}