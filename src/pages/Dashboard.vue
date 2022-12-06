<template>
  <q-page class="q-pa-lg">
    <div class="row justify-center q-gutter-lg q-gutter-x-xl items-center">
      <div
        class="col-3 col-sm-auto col-xs-12"
        v-for="item in realDemos"
        :key="item.id"
      >
        <div class="card-container">
            <q-card class="demo-card shadow-4" @click="toDemo(item.path)">
                <img class="cover" src="https://cdn.quasar.dev/img/mountains.jpg">

                <q-card-section class="desc">
                    <div class="text-h6">{{item.title}}</div>
                    <div class="text-subtitle2">by John Doe</div>
                </q-card-section>
            </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
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
    path:'/ChineseColor'
  },{
    id: 1,
    name: "nobel",
    title: "Nobel Prize Vis",
    path:'/Nobel'
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

.demo-card:hover 
    cursor: pointer
    box-shadow: 0px 0px 10px 5px #ebff5c
    width: 390px
    height: 230px
    position: relative
    left: 5px
    top:5px
    .cover
        height: 130px
        width: 320px
        position: relative
        top: -10px
        left: 35px
    .desc
        margin-top: -20px
.cover
    height: 100px
    width: 400px
    object-fit: cover

</style>
