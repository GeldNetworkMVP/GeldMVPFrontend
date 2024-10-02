/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, FormGroup } from '@angular/forms';

declare module '@angular/forms' {

  export interface FormControl {
    metadata : {
        id: string
    } | null
  }

  export interface FormGroup {
    metadata : {
        id: string
    } | null
  }
}
