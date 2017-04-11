import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class ArraySubject{
    private array : any[];
    private arraySubject : BehaviorSubject<any[]> = new BehaviorSubject(this.array);

    constructor(array?){
        this.array = array;
    }

    public set value( array : any[]){
        this.array = array;
        this.arraySubject.next(this.array);
    }

    public get value() : any[]{
        return this.array;
    }


    public push(item){
        this.array.push(item);
        this.arraySubject.next(this.array);
    }

    public pop(){
        this.array.pop();
        this.arraySubject.next(this.array);
    }

    public splice(idx,count,replacement?){
        replacement ?  this.array.splice(idx,count,replacement) : this.array.splice(idx,count);
        this.arraySubject.next(this.array);
    }

    public subscribe( fn ) : any{
        this.arraySubject.subscribe(fn);
    }

}