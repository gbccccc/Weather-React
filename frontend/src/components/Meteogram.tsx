import {HourlyDetailStats} from "../scripts/types.ts";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import highchartsWindbarb from 'highcharts/modules/windbarb';

highchartsWindbarb(Highcharts);
HighchartsMore(Highcharts)

function Meteogram({hourly}: {
  hourly: HourlyDetailStats[]
}) {
  {
    // Parallel arrays for the chart data, these are populated as the JSON file
    // is loaded
    let symbols = [];
    let humidity: { x: number, y: number }[] = [];
    let precipitationsError = []; // Only for some data sets
    let winds: { x: number, value: number, direction: number }[] = [];
    let temperatures: { x: number, y: number }[] = [];
    let pressures: { x: number, y: number }[] = [];
    let chart
    // Initialize
    // let container = container;

    // Run
    parseYrData();

    /**
     * Draw blocks around wind arrows, below the plot area
     */
    function drawBlocksForWindArrows(chart: {
      xAxis: any[];
      renderer: {
        path: (arg0: any[]) => {
          (): any;
          new(): any;
          attr: {
            (arg0: { stroke: any; 'stroke-width': number; }): { (): any; new(): any; add: { (): void; new(): any; }; };
            new(): any;
          };
        };
      };
      plotTop: any;
      plotHeight: any;
      options: { chart: { plotBorderColor: any; }; };
      get: (arg0: string) => {
        (): any;
        new(): any;
        markerGroup: {
          (): any;
          new(): any;
          attr: { (arg0: { translateX: any; }): void; new(): any; };
          translateX: number;
        };
      };
    }) {
      const xAxis = chart.xAxis[0];

      for (
          let pos = xAxis.min, max = xAxis.max, i = 0;
          pos <= max + 36e5; pos += 36e5,
              i += 1
      ) {

        // Get the X position
        const isLast = pos === max + 36e5,
            x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        const isLong = true

        chart.renderer
            .path([
              'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
              'L', x, chart.plotTop + chart.plotHeight + 32,
              'Z'
            ])
            .attr({
              stroke: chart.options.chart.plotBorderColor,
              'stroke-width': 1
            })
            .add();
      }

      // Center items in block
      chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
      });

    };

    /**
     * Build and return the Highcharts options structure
     */
    function getChartOptions() {
      return {
        chart: {
          marginBottom: 70,
          marginRight: 40,
          marginTop: 50,
          plotBorderWidth: 1,
          height: 310,
          alignTicks: false,
          scrollablePlotArea: {
            minWidth: 720
          }
        },

        defs: {
          patterns: [{
            id: 'precipitation-error',
            path: {
              d: [
                'M', 3.3, 0, 'L', -6.7, 10,
                'M', 6.7, 0, 'L', -3.3, 10,
                'M', 10, 0, 'L', 0, 10,
                'M', 13.3, 0, 'L', 3.3, 10,
                'M', 16.7, 0, 'L', 6.7, 10
              ].join(' '),
              stroke: '#68CFE8',
              strokeWidth: 1
            }
          }]
        },

        title: {
          text: 'Hourly Weather (For Next 5 Days)',
          align: 'center',
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
          }
        },

        tooltip: {
          shared: true,
          useHTML: true,
          headerFormat:
              '<small>{point.x:%A, %b %e, %H:%M}<br>'
        },

        xAxis: [{ // Bottom X axis
          type: 'datetime',
          tickInterval: 2 * 36e5, // two hours
          minorTickInterval: 36e5, // one hour
          tickLength: 0,
          gridLineWidth: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 30,
          showLastLabel: true,
          labels: {
            format: '{value:%H}'
          },
          crosshair: true
        }, { // Top X axis
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format: '{value:<span style="font-size: 12px; font-weight: ' +
                'bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: 8
          },
          opposite: true,
          tickLength: 20,
          gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
          title: {
            text: null
          },
          labels: {
            format: '{value}°',
            style: {
              fontSize: '10px'
            },
            x: -3
          },
          plotLines: [{ // zero plane
            value: 0,
            color: '#BBBBBB',
            width: 1,
            zIndex: 2
          }],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // precipitation axis
          title: {
            text: null
          },
          labels: {
            enabled: false
          },
          gridLineWidth: 0,
          tickLength: 0,
          minRange: 10,
          min: 0

        }, { // Air pressure
          allowDecimals: false,
          title: { // Title on top of axis
            text: 'inHg',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
              fontSize: '10px',
              color: '#ffd500'
            },
            textAlign: 'left',
            x: 3
          },
          labels: {
            style: {
              fontSize: '8px',
              color: '#ffd500'
            },
            y: 2,
            x: 3
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: false
        }],

        legend: {
          enabled: false
        },

        plotOptions: {
          series: {
            pointPlacement: 'between'
          }
        },


        series: [{
          name: 'Temperature',
          data: temperatures,
          type: 'spline',
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true
              }
            }
          },
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                ' ' +
                '{series.name}: <b>{point.y}°C</b><br/>'
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8'
        }, {
          name: 'Humidity',
          type: 'column',
          color: 'url(#precipitation-error)',
          yAxis: 1,
          groupPadding: 0,
          pointPadding: 0,
          tooltip: {
            valueSuffix: '%',
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                ' ' +
                '{series.name}: <b>{point.minvalue} mm - ' +
                '{point.maxvalue} mm</b><br/>'
          },
          grouping: false,
          dataLabels: {
            filter: {
              operator: '>',
              property: 'maxValue',
              value: 0
            },
            style: {
              fontSize: '8px',
              color: 'gray'
            }
          }
        }, {
          name: 'Humidity',
          data: humidity,
          type: 'column',
          color: '#68CFE8',
          yAxis: 1,
          groupPadding: 0,
          pointPadding: 0,
          grouping: false,
          dataLabels: {
            filter: {
              operator: '>',
              property: 'y',
              value: 0
            },
            style: {
              fontSize: '8px',
              color: '#666'
            }
          },
          tooltip: {
            valueSuffix: '%'
          }
        }, {
          name: 'Air pressure',
          color: "#ffd500",
          data: pressures,
          marker: {
            enabled: false
          },
          shadow: false,
          tooltip: {
            valueSuffix: ' inHg'
          },
          dashStyle: 'shortdot',
          yAxis: 2
        }, {
          name: 'Wind',
          type: 'windbarb',
          id: 'windbarbs',
          color: "#3b5da2",
          lineWidth: 1.5,
          data: winds,
          vectorLength: 18,
          yOffset: -15,
          tooltip: {
            valueSuffix: ' mph'
          }
        }]
      };
    };

    /**
     * Post-process the chart from the callback function, the second argument
     * Highcharts.Chart.
     */
    function onChartLoad(chart: {
      xAxis: any[]; renderer: {
        path: (arg0: any[]) => {
          (): any;
          new(): any;
          attr: {
            (arg0: { stroke: any; "stroke-width": number; }): { (): any; new(): any; add: { (): void; new(): any; }; };
            new(): any;
          };
        };
      }; plotTop: any; plotHeight: any; options: { chart: { plotBorderColor: any; }; }; get: (arg0: string) => {
        (): any;
        new(): any;
        markerGroup: {
          (): any;
          new(): any;
          attr: { (arg0: { translateX: any; }): void; new(): any; };
          translateX: number;
        };
      };
    }) {
      drawBlocksForWindArrows(chart);
    }

    /**
     * Create the chart. This function is called async when the data file is loaded
     * and parsed.
     */
    // function createChart() {
    //   chart = new Highcharts.Chart(getChartOptions(), chart => {
    //     onChartLoad(chart);
    //   });
    // };

    /**
     * Handle the data. This part of the code is not Highcharts specific, but deals
     * with yr.no's specific data format
     */
    function parseYrData() {
      // Loop over hourly (or 6-hourly) forecasts
      hourly.forEach((node, i) => {

        const x = new Date(node.startTime).getTime()

        // Populate the parallel arrays
        temperatures.push({
          x,
          y: node.values.temperature
        });

        humidity.push({
          x,
          y: node.values.humidity
        });

        if (i % 2 === 0) {
          winds.push({
            x,
            value: node.values.windSpeed,
            direction: node.values.windDirection
          });
        }

        pressures.push({
          x,
          y: node.values.pressureSeaLevel
        });
      });
    };

    // new Meteogram("hourly-chart")

    return (
        <div id="temperature-min-max-chart">
          <HighchartsReact
              highcharts={Highcharts}
              options={getChartOptions()}
              callback={onChartLoad}
          />
        </div>
    )
  }
}

export default Meteogram