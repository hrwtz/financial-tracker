import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SentenceCasePipe } from './sentencecase.pipe';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SentenceCasePipe
	],
	exports: [
		SentenceCasePipe
	]
})
export class SharedModule { }
