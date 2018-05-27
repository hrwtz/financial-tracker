import { Injectable } from '@angular/core';

import { Options as HighchartsOptions } from 'highcharts';

@Injectable()
export class ChartOptionsService {
	getBaseOptions(options: HighchartsOptions): HighchartsOptions {
		return Object.assign({
			credits: {
				enabled: false
			},

			legend: {
				enabled: false
			},

			xAxis: {
				type: 'datetime'
			},

			plotOptions: {
				series: {
					pointIntervalUnit: 'month'
				},
				column: {
					groupPadding: .1,
					stacking: 'normal',
					pointPadding: 0,
					borderWidth: 0,
					dataLabels: {
						enabled: false
					}
				}
			},

			tooltip: {
				xDateFormat: '%b %Y',
				pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>${point.y:,.2f}</b><br/>'
			}
		}, options);
	}
}
