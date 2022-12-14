<template>
  <q-page class="q-pa-lg">
    <div id="stage" ref="stage"></div>
    <div class="card">
      <span class="color"></span>
      <span class="color-hex"></span>
    </div>
  </q-page>
</template>

<script setup>
import * as d3 from "d3";
import mock from "./zhongguose_colors_sort.json";
import { onMounted, onUnmounted } from "vue";

// import { Scene } from "spritejs";
// import { Cube, Light, shaders, Plane } from "sprite-extend-3d";
const { Scene } = spritejs;
const { Cube, Light, shaders, Plane } = spritejs.ext3d;

const draw = async function () {
  console.log("D3开始绘制---");
  const colors = mock;
  console.log("拿到文件---");
  const container = document.getElementById("stage");
  console.log(container);
  const scene = new Scene({
    container,
    displayRatio: 2,
  });

  // https://spritejs.org/#/zh-cn/ext3d/index?id=%e5%9d%90%e6%a0%87%e5%92%8c%e7%9b%b8%e6%9c%ba
  const layer = scene.layer3d("fglayer", {
    camera: {
      fov: 30, // 35 视野宽度，默认是45度
      pos: [19, 20, 22],
      // mode: 'orthographic',
    },
  });
  layer.camera.lookAt([0, 0, 0]);

  // https://www.bookstack.cn/read/spritejs-v3/zh-cn-api-ext3d-camera.md
  layer.camera.mode = "orthographic"; // perspective
  // layer.camera.mode = 'perspective';

  // const light = new Light({
  //     direction: [-3, -3, -1],
  //     color: [1, 1, 1, 1],
  // });

  // layer.addLight(light);

  const program = layer.createProgram({
    vertex: shaders.GEOMETRY.vertex,
    fragment: shaders.GEOMETRY.fragment,
  });

  const cubeWidth = 0.3;
  const cubeHeight = 1;
  const selection = d3.select(layer);
  const chart = selection
    .selectAll("cube")
    .data(colors)
    // .join(() => new Cube(program))
    .enter()
    .append(() => new Cube(program))
    .attr("id", (d, i) => i)
    .attr("width", cubeWidth)
    .attr("depth", cubeWidth)
    .attr("height", cubeHeight)
    // Note: use scaleY. DONT use height directly because the change of height
    // will rebuild geometry(much slower).
    // .attr('height', 0)
    // .attr('scaleY', 0.001)
    .attr("pos", (d, i) => {
      const x = -2 + 0.5 * Math.floor(i / 27);
      const z = -5 + 0.5 * (i % 27);
      return [x, 0, z];
    })
    .attr("colors", (d) => d.hex);

  // https://spritejs.org/#/zh-cn/ext3d/text
  const titleTexture = layer.createText("Chinese Traditional color Vis", {
    font: "40px Arial",
    fillColor: "white",
  });

  // titleProgram 单独一个 program
  const titleProgram = layer.createProgram({
    ...shaders.NORMAL_TEXTURE,
    texture: titleTexture,
    cullFace: null,
  });
  const title = new Plane(titleProgram, {
    width: 15,
    height: (15 * titleTexture.image.height) / titleTexture.image.width,
    colors: "#1474a4",
    rotateY: "93",
    x: -7,
    z: 1,
    y: 0.5,
  });

  const authorTexture = layer.createText("by Lw", {
    font: "40px Arial",
    fillColor: "white",
  });

  const authorProgram = layer.createProgram({
    ...shaders.NORMAL_TEXTURE,
    texture: authorTexture,
    cullFace: null,
  });
  const author = new Plane(authorProgram, {
    width: 3,
    height: (3 * authorTexture.image.height) / authorTexture.image.width,
    colors: "#1474a4",
    rotateY: "93",
    x: -4,
    z: -2,
    y: 0.5,
  });

  const cardColor = document.querySelector(".card");
  const cardColorFont = document.querySelector(".color");
  const cardColorHex = document.querySelector(".color-hex");

  layer.addEventListener("click", (evt) => {
    chart.attr("scaleY", 1).attr("y", 0);
    cardColor.style.opacity = 1;

    if (evt.target !== layer) {
      console.log(evt.target);
      console.log(evt.target.attributes);
      evt.target.attributes.y = 1 / 2;
      evt.target.attributes.scaleY = 2;
      console.log(evt.target.attributes);

      // evt.target.attributes.height = 1.5;
      let idx = evt.target.id;
      cardColor.style.background = colors[idx].hex;
      cardColorFont.style.color = colors[idx].hex;
      cardColorFont.style.textShadow = 'red';
      cardColorFont.textContent = colors[idx].name;
      cardColorHex.textContent = colors[idx].hex;
    } else if (evt.target === layer) {
      cardColor.style.opacity = 0;
    }
  });

  // 让元素支持点击事件
  layer.setRaycast();

  //  text
  layer.append(title);
  layer.append(author);

  layer.setOrbit();

  console.log("绘制完毕---");
};

onMounted(() => {
  draw();
});
</script>

<style scoped>
@font-face {
  font-family: "FangZhengQingKeBenYueSong";
  src: url("./data/FZQKBYSJW.TTF");
}

html {
  height: 100%;
}

body {
  min-height: 100%;
  background-color: #f0eadc;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* overflow: hidden; */
}

#stage {
  width: 100vw;
  height: 100vh;
}

.card {
  width: 40px;
  height: 200px;
  position: fixed;
  left: 270px;
  top: 70px;
  border-radius: 40px;
  font-family: "FangZhengQingKeBenYueSong", Helvetica, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 5px 5px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  opacity: 0;
}

.card::before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  left: 32%;
  top: 20px;
}

.card::after {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  left: 32%;
  bottom: 20px;
}

.color {
  font-size: 30px;
  font-weight: normal;
  writing-mode: vertical-rl;
  letter-spacing: 6px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.1);
  text-align: center;

  position: relative;
  left: -70%;
}

.color-hex {
  position: relative;
  right: 55%;
  bottom: -60%;
  font-size: 14px;
}
</style>
