import {DetailStats} from "src/scripts/types.ts";
import Highcharts from "highcharts";
import {Options} from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
HighchartsMore(Highcharts)

function TemperatureMinMaxChart({weatherDetails}: {
  weatherDetails: DetailStats[]
}) {
  let data = []
  for (let weatherDetail of weatherDetails) {
    data.push([new Date(weatherDetail.startTime).getTime(), weatherDetail.values.temperatureMin, weatherDetail.values.temperatureMax])
  }
  const options: Options = {
    chart: {
      type: 'arearange',
      zooming: {
        type: 'x'
      },
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1
      }
    },
    title: {
      text: 'Temperature Ranges (Min, Max)'
    },
    xAxis: {
      type: 'datetime',
      accessibility: {
        rangeDescription: 'Range: Jan 1st 2017 to Dec 31 2017.'
      }
    },
    yAxis: {
      title: {
        text: null
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: '°F',
      xDateFormat: '%A, %b %e'
    },
    legend: {
      enabled: false
    },
    series: [{
      name: 'Temperatures',
      type: 'arearange',
      data: data,
      color: {
        linearGradient: {
          x1: 0,
          x2: 0,
          y1: 0,
          y2: 1
        },
        stops: [
          [0, '#ff5900'],
          [1, '#03bafc']
        ]
      }
    }]
  }

  return (
      <div id="temperature-min-max-chart">
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
      </div>
  )
}

export default TemperatureMinMaxChart