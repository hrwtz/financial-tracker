import { Injectable } from '@angular/core';
import { Options as HighchartsOptions, ColumnChartSeriesOptions } from 'highcharts';

import { LocalStorageService } from '../../core/local-storage.service';
import { ChartOptionsService } from '../shared/chart-options.service';

@Injectable()
export class NetWorthWithInvestmentsChartService {
	constructor(
		private localStorageService: LocalStorageService,
		private chartOptionsService: ChartOptionsService
	) {}

	private getSeries(): ColumnChartSeriesOptions[] {
		const manualData = this.localStorageService.get('manual-data'),
			investmentIncomeData = manualData.investments.income.reverse(),
			allNetWorthData = manualData.netWorth.all.reverse(),
			investedAmount = [];

		investmentIncomeData.forEach((row, i) => {
			const prev = i ? investedAmount[investedAmount.length - 1] : 0;
			investedAmount.push(row.value + prev);
		});

		return [{
			name: 'Investment Income',
			data: investedAmount,
			pointStart: new Date(allNetWorthData[0].date).getTime()
		}, {
			name: 'Contributed Wealth',
			data: allNetWorthData.map((row, i) => row.value - investedAmount[i]),
			pointStart: new Date(allNetWorthData[0].date).getTime()
		}];
	}

	getOptions(): HighchartsOptions {
		return this.chartOptionsService.getBaseOptions({
			chart: {
				type: 'column'
			},

			title: {
				text: 'Net Worth Compared To Investments'
			},

			yAxis: {
				title: {
					text: 'Net Worth'
				}
			},

			series: this.getSeries()
		});
	}
}
