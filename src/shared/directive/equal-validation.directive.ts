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
    private valFn = Validators.nullValidator;

    ngOnChanges(changes: SimpleChanges): void {
        const validateEqual = changes['validateEqual'];
        if (validateEqual) {
            this.valFn = equalFieldValidator(validateEqual.currentValue);
        } else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

export function equalFieldValidator(validateEqual: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        // self value
        const v = control.value;
        // control value
        const e = control.root.get(validateEqual);
        // value not equal
        if (e && v !== e.value) {
            e.setErrors({ match: false });
            return {
                match: false
            };
        }

        if (e && v === e.value) {
            if (e.errors) {
                delete e.errors['match'];
                if (!Object.keys(e.errors).length) {
                    e.setErrors(null);
                }
            }
        }
        return null;
    };
}