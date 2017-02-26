import { Directive, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Validator, Validators, ValidatorFn, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: EqualValidatorDirective, multi: true }
    ]
})
export class EqualValidatorDirective implements Validator, OnChanges {
    @Input() validateEqual: string;
    @Input() reverse: string;
    private valFn = Validators.nullValidator;

    private get isReverse() {
        if (!this.reverse) {
            return false;
        };
        return this.reverse === 'true' ? true : false;
    }

    ngOnChanges(changes: SimpleChanges): void {
        const validateEqual = changes['validateEqual'];
        const reverse = changes['reverse'];
        if (validateEqual) {
            this.valFn = equalValidator(validateEqual.currentValue, reverse.currentValue);
        } else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}


export function equalValidator(validateEqual: string, isReverse?: boolean): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // self value
        const v = control.value;

        // control value
        const e = control.root.get(validateEqual);

        // value not equal
        if (e && v !== e.value && !isReverse) {
            return {
                match: false
            };
        }

        // value equal and reverse
        if (e && v === e.value && isReverse) {
            delete e.errors['match'];
            if (!Object.keys(e.errors).length) {
                e.setErrors(null);
            }
        }

        // value not equal and reverse
        if (e && v !== e.value && isReverse) {
            e.setErrors({ match: false });
        }

        return null;
    };
}