import { Injectable } from '@angular/core';
import { Options as HighchartsOptions, ColumnChartSeriesOptions } from 'highcharts';

import { LocalStorageService } from '../../core/local-storage.service';
import { ChartOptionsService } from '../shared/chart-options.service';

@Injectable()
export class NetWorthByTypeChartService {
	constructor(
		private localStorageService: LocalStorageService,
		private chartOptionsService: ChartOptionsService
	) {}

	private getSeries(): ColumnChartSeriesOptions[] {
		const manualData = this.localStorageService.get('manual-data'),
			series = [];

		for (const key of Object.keys(manualData.netWorth)) {
			const netWorthRowData = manualData.netWorth[key].reverse();

			if (key === 'all') {
				continue;
			}

			series.push({
				name: key,
				data: netWorthRowData.map(row => row.value),
				pointStart: new Date(netWorthRowData[0].date).getTime()
			});
		}

		return series;
	}

	getOptions(): HighchartsOptions {
		return this.chartOptionsService.getBaseOptions({
			chart: {
				type: 'column'
			},

			title: {
				text: 'Net Worth By Type'
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
