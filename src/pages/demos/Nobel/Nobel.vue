<template>
  <q-page class="bgc q-pa-lg">
    <div id="wrapper"></div>
  </q-page>
</template>

<script setup>
import { onMounted, nextTick} from "vue";
import * as d3 from "d3";
import {
  countryList,
  nobelDotColor,
  nbAllPerson,
  secondPieData,
  personCountPerYP,
  NBData,
  // nobelImgSource,
} from "./datas.js";
let nbAllPersonData = nbAllPerson;
let selectedYear = {}
let dataset_init = secondPieData.slice(-1)[0]
let pr_dict = ['物理','化学','生物','文学','经济']
const filterYear = (year)=>{
    if(year === 116) return nbAllPersonData
    let res_data = []
    for(let key in countryList){
        let matrix = new Array(5).fill(0).map(()=>new Array(5).fill(0))
        res_data.push(matrix)
    }//year = 1
    for(let i=0; i<year; i++){
        let YearNB = NBData[i].slice(1)
        for(let j in YearNB){
            let country_index = countryList.indexOf(YearNB[j][4])
            let age_type = Math.floor(YearNB[j][3]/20)
            let prize_type = YearNB[j][1]-1;
            // console.log(`${1901+i}年：${YearNB[j][4]}(${country_index})、${YearNB[j][3]}岁${age_type} 的${YearNB[j][0]} 获得了${pr_dict[prize_type]}(${prize_type})`);
            if(prize_type<4 && country_index<countryList.length && age_type<4){
                res_data[country_index][age_type][prize_type]++;
            }
        }
    }
    return res_data
}

function drawChart() {
  const width = 640;
  const scale = 0.85;
  let dimensions = {
    width: width,
    height: width,
    radius: width / 2,
    pieInnerRadius: 95,
    pieOuterRadius: 110,
    ageInnerRadius: 125,
    ageOuterRadius: 200,
    countryBarRadius: 216,
    yearRadius: 216 + 62,
  };
  const minilize = ()=>{
    for(let key in dimensions){
        dimensions[key] = dimensions[key]*scale;
    }
    dimensions['width'] = width*0.9
    dimensions['height'] = width*0.9
    dimensions['ageInnerRadius'] = 125*scale - 12
    dimensions['ageOuterRadius'] = 200*scale + 8
  }
  minilize();

  const bounds = d3
    .select("#wrapper")
    .append("svg")
    .attr(
      "viewBox",
      `${-dimensions.width / 2} ${-dimensions.height / 2} ${dimensions.width} ${
        dimensions.height
      }`
    )
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)
    .append("g");
    
      let initYear = 115;
      function drawPieChart() {
          const arc = d3
          .arc()
          .innerRadius(dimensions.pieInnerRadius -20)
          .outerRadius(dimensions.pieOuterRadius -20);
          
        const pie = d3.pie().sort(null);

    let allPath = bounds
      .selectAll("path")
      // .data(pie(dataset_init))
      .data(pie(dataset_init))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => {
        if (i == 5) return "#5c5c5c";
        if (i == 6) return "#FFFFFF";
        return nobelDotColor[i];
      }).exit().remove();
  }

  drawPieChart();

  const axis = bounds
    .append("g")
    .attr("fill-opacity", 0)
    .attr("class", "grid-line");

  const countryScale = d3
    .scaleLinear()
    .domain([0, countryList.length])
    .range([0, Math.PI * 2]);

  const getCoordinatesForAngle = (angle, radius) => [
    Math.cos(angle - Math.PI / 2) * radius,
    Math.sin(angle - Math.PI / 2) * radius,
  ];

  function drawAxis() {
    d3.range(5).map((i) => {
      const cr =
        dimensions.ageInnerRadius +
        (i * (dimensions.ageOuterRadius - dimensions.ageInnerRadius)) / 4;
      axis.append("circle")
      .attr("stroke", "#6962c8")
      .attr("r", cr);

      axis
        .append("text")
        .attr("y", -cr)
        .attr("dx", ".2em")
        .attr("dy", "-.5em")
        .attr("fill-opacity", 0.6)
        .attr("fill", '#6962c8')
        .text(i != 4 ? (i + 1) * 20 : "");
    });

    countryList.map((country, i) => {
      const [x1, y1] = getCoordinatesForAngle(
        countryScale(i),
        dimensions.ageInnerRadius
      );
      const [x2, y2] = getCoordinatesForAngle(
        countryScale(i),
        dimensions.ageOuterRadius
      );

      axis
        .append("line")
        .attr("stroke", "#6962c8")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
    });
  }
  drawAxis();

  // title
  const title = bounds
    .append("g")
    .attr("text-anchor", "middle")
    .attr("font-size", "1.7em")
    .attr("font-family", "Arial")
    .attr("cursor", "pointer");
  title.append("text").text("Nobel Prize").attr("dy", "-.5em");
  title
    .append("text")
    .text("1901-2015")
    .attr("font-size", ".9em")
    .attr('class','date-text')
    .attr("dy", "1.2em");

  let countryPrize = personCountPerYP[114];
  let new_countryPrize = [];
  const keys = ["Phisics", "Chemistry", "Physiology or Medicine", "Literature", "Economics"];
//   console.log(keys);
//   console.log(countryPrize);
  countryPrize.forEach((arr, i) => {
    const new_item = {};
    arr.forEach((item, j) => {
      new_item[keys[j]] = item;
    });
    new_item["sum"] = d3.sum(arr);
    new_countryPrize.push(new_item);
  });

  const stackedData = d3.stack().keys(keys)(new_countryPrize);
  console.log(stackedData); // 42=>5 同一组的同一个奖项的同一个group

  // text 排列，参考这个实现
  // https://observablehq.com/@d3/radial-stacked-bar-chart
  function drawCountry() {
    countryList.map((country, i) => {
      const [x, y] = getCoordinatesForAngle(
        countryScale(i),
        dimensions.countryBarRadius
      );

      const countryGroup = bounds
        .append("g")
        .attr(
          "transform",
          `rotate(${(countryScale(i) * 180) / Math.PI - 90 -2}) translate(${
            dimensions.countryBarRadius - 5 + 5
          }, 0)`
        );

      countryGroup
        .append("text")
        .text(country)
        .attr("fill", "#a29bfe")
        .style("text-anchor", (d) =>
          countryScale(i) < Math.PI ? "start" : "end"
        )
        .attr("transform", (d) =>
          countryScale(i) < Math.PI
            ? "translate(0, 15)"
            : "rotate(-180) translate(0,-7)"
        );
    });
  }

  drawCountry();

  // https://www.d3-graph-gallery.com/graph/barplot_stacked_basicWide.html
  // 显示效果不对，仍有 bug
  function drawCountryPrizeBarChart() {
    const stackBar = bounds
      .append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d, idx) => nobelDotColor[idx]);

    stackBar
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr(
        "transform",
        (d, i) =>
          `rotate(${(countryScale(i) * 180) / Math.PI - 90 -2}) translate(${
            dimensions.countryBarRadius - 4 + 2
          }, 20)`
      )
      .attr("x", (d) => Math.sqrt(Math.sqrt(d[0])) * 10)
      .attr("height", 10)
      .attr("width", (d) => Math.sqrt(Math.sqrt(d[1] - d[0])) * 10);
  }

  drawCountryPrizeBarChart();

  function drawLegend() {
    const legend = bounds
      .append("g")
      .selectAll("g")
      .data(keys)
      .join("g")
      .attr("transform", (d, i) => `translate(-295, ${200 + 20 * i -480})`);

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d, i) => nobelDotColor[i]);

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }

  drawLegend();

  function drawEachPrizeCircle(data) {
    // iAll 国家 / jAll 年龄段 / kAll 各奖项人数，也是审查可视化图表时根据 class 发现的
    d3.range(countryList.length).map((iAll) => {
      d3.range(5).map((jAll) => {
        d3.range(5).map((kAll) => {
          const angle =
            countryScale(iAll) +
            ((kAll + 1) * ((2 * Math.PI) / countryList.length)) / 6;
          const age = 10 + jAll * 20;
          const personAgeToPoint = 90 - ((age - 20) / 80) * 75;
          const radius = (dimensions.countryBarRadius - personAgeToPoint)*1.04;
          const [x, y] = getCoordinatesForAngle(angle, radius);

          bounds
            .selectAll(`.AllPerson${iAll}`)
            .data(data[iAll][jAll])
            .join("circle")
            .attr("class", `allPersonPoints_${iAll}_${jAll}_${kAll} dot-nodes`)
            .attr("fill-opacity", 0.2)
            .attr("fill", nobelDotColor[kAll])
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 1.5 *0.7 * Math.sqrt(data[iAll][jAll][kAll]));
        });
      });
    });
  }

  drawEachPrizeCircle(nbAllPersonData);

  function drawYear() {
    const yearRange = 116;
    const yearScale = d3
      .scaleLinear()
      .domain([0, yearRange])
      .range([0, 2 * Math.PI]);
    d3.range(yearRange).map((year) => {
      const [x, y] = getCoordinatesForAngle(
        yearScale(year),
        dimensions.yearRadius
      );

      const yearGroup = bounds
        .append("g")
        .attr(
          "transform",
          `rotate(${(yearScale(year) * 180) / Math.PI - 90}) translate(${
            dimensions.yearRadius + 10
          }, 0)`
        );
      const rect = yearGroup
        .append("rect")
        .attr("class", "perYearButton_" + year)
        .attr("id", "" + year)
        .attr("width", 30)
        .attr("height", 16)
        .attr("fill", "#ACEDED")
        .attr("fill-opacity", year == 0 ? 1 : 0)
        .attr("cursor", "pointer");

      yearGroup
        .append("text")
        .text(year == 0 ? "ALL" : year % 10 == 0 ? 1900 + year : "-")
        .attr("dy", "1.1em")
        .attr("class", "timeText_" + year)
        .attr("fill", "#000000")
        .attr("font-size", 12)
        .attr("font-family", "Arial")
        .attr("fill-opacity", 1)
        .attr("cursor", "pointer")
        .attr("pointer-events", "none")
        .attr("text-anchor", (d) =>
          yearScale(year) < Math.PI ? "start" : "end"
        )
        .attr("transform", (d) =>
          yearScale(year) < Math.PI
            ? "rotate(0)"
            : "rotate(-180) translate(0, -20)"
        );
        if(year === 0){
            selectedYear = d3.select(".perYearButton_0")
        }
      rect
        .on("click", function (){
            selectedYear.attr("fill-opacity", 0);
            d3.select(".timeText_" + selectedYear.attr("id"))
            .text(selectedYear.attr("id") == 0 ? "ALL" : year % 10 == 0 ? 1900 + year : "-");

            selectedYear = d3.select(this)
            selectedYear.attr("fill-opacity", 1);

            d3.select(".timeText_" + selectedYear.attr("id"))
            .text(year == 0 ? "ALL" : 1900 + year)
            .attr("fill-opacity", 1);

            console.log('clicked',d3.select(this), d3.select(".perYearButton_0"));

            let seYear = selectedYear.attr("id")==='0'? secondPieData.length-1:eval(selectedYear.attr("id"))-1;
            
            dataset_init = secondPieData[seYear]
            bounds.selectAll("path").remove();
            drawPieChart();
            bounds.selectAll("text.date-text")
            .text(seYear === secondPieData.length-1 ? '1901-2015':''+(seYear+1901))
            bounds.selectAll('.dot-nodes').remove();
            drawEachPrizeCircle(filterYear(seYear+1));

        })
        .on("mouseover", function () {
          // 背景及年份文字
          d3.select(this).transition().duration(100).attr("fill-opacity", 1);

          d3.select(".timeText_" + d3.select(this).attr("id"))
            .transition()
            .duration(100)
            .text(year == 0 ? "ALL" : 1900 + year)
            .attr("fill-opacity", 1);
        })
        .on("mouseout", function () {
        if (d3.select(this).attr("id") == selectedYear.attr("id")){
            return
        }
          d3.select(this).transition().duration(500).attr("fill-opacity", 0);

          d3.select(".timeText_" + d3.select(this).attr("id"))
            .transition()
            .duration(100)
            // .attr("fill-opacity", 0);
            .text(year == 0 ? "ALL" : year % 10 == 0 ? 1900 + year : "-");
        });
    });
  }

  drawYear();

}

onMounted(() => {
    drawChart();
});
</script>

<style scoped>
.bgc {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em 2em;
  /* font-family: 'Inter var', sans-serif; */
  font-size: 10px;
  color: #34495e;
  background: #fdf1cc;
}

/* .grid-line {
  fill: transparent !important;
  stroke: #6962c8 !important;
} */
</style>
