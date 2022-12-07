<template>
  <q-page class="q-pa-lg">
    <div class="row justify-center q-gutter-lg q-gutter-x-xl items-center">
      <div
        class="col-3 col-sm-auto col-xs-12"
        v-for="item in realDemos"
        :key="item.id"
      >
        <div class="card-container q-mt-lg">
            <q-card class="demo-card shadow-4" @click="toDemo(item.path)">
                <img class="cover" :src="item.img">

                <q-card-section class="desc">
                    <div class="text-h6">{{item.title}}</div>
                    <div class="text-subtitle2">by Li Wang</div>
                </q-card-section>
            </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { QPage, QCard, QCardSection } from 'quasar';
import { useRouter } from 'vue-router'
import { getImageUrl } from '../utils/staticImport';

const router = useRouter()
const demos = [
  {
    id: 0,
    name: "c-color",
    title: "Chinese Traditional Color",
    path:'/ChineseColor'
  },
];
const getDemos = (num: number) => {
  let item = demos[0];
  let res = [];
  let index = item.id;
  for (let i = index; i < num; i++) {
    let temp = { ...item, id: i };
    res.push(temp);
  }
  return res;
};
const realDemos = [
    {
    id: 0,
    name: "c-color",
    title: "Chinese Traditional Color",
    path:'/ChineseColor',
    img: getImageUrl('demo-colors')
  },{
    id: 1,
    name: "nobel",
    title: "Nobel Prize Vis",
    path:'/Nobel',
    img:getImageUrl('demo-nobel')
  },
  {
    id: 2,
    name: "explorer",
    title: "Data Explorer",
    path:'/DataExplorer',
    img:getImageUrl('demo-nobel')
  },
]
const toDemo = (path: string)=>{
    router.push(path)
}
</script>

<style scoped lang="sass">
.card-container
    height: 250px
    width: 400px

.demo-card
  max-height: 200px
  background: #fffef8

.demo-card:hover 
    cursor: pointer
    box-shadow: 3px 6px 5px 1px #9a8878
    background: #fffefa
    width: 390px
    height: 230px
    position: relative
    left: 5px
    top:5px
    transition: 1s
    .cover
        height: 130px
        width: 320px
        position: relative
        top: -20px
        left: 35px
    .desc
        margin-top: -20px
.cover
    height: 100px
    width: 400px
    object-fit: cover
    box-shadow: 0px 6px 5px #33333390
    border-radius: 10%

</style>
