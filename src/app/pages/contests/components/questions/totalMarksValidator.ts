import { AbstractControl, ValidatorFn } from '@angular/forms';

export function totalMarksValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const totalMarks = control.get('total_marks');
    const yes = control.get('yes');
    const no = control.get('no');

    if (totalMarks && yes && no) {
      const sum = Number(yes.value) + Number(no.value);
      if (sum !== Number(totalMarks.value)) {
        return { totalMarksMismatch: true };
      }
    }
    return null;
  };
}