import { Injectable } from '@angular/core';
import { Options as HighchartsOptions, LineChartSeriesOptions } from 'highcharts';

import { LocalStorageService } from '../../core/local-storage.service';
import { ChartOptionsService } from '../shared/chart-options.service';

@Injectable()
export class BaseIncomechartService {
	constructor(
		private localStorageService: LocalStorageService,
		private chartOptionsService: ChartOptionsService
	) {}

	private getSeries(): LineChartSeriesOptions {
		const manualData = this.localStorageService.get('manual-data'),
			baseIncomeData = manualData.misc.baseIncome.reverse();

		return {
			data: baseIncomeData.map(row => row.value),
			pointStart: new Date(baseIncomeData[0].date).getTime()
		};
	}

	getOptions(): HighchartsOptions {
		return this.chartOptionsService.getBaseOptions({
			title: {
				text: 'Base Income'
			},

			yAxis: {
				title: {
					text: 'Base Income'
				}
			},

			series: [Object.assign({
				name: 'Base Income'
			}, this.getSeries())]
		});
	}
}
