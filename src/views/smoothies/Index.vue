<template>
  <div class="index container section"><br>
    <div class="row" v-if="loading">
      <div class="col s12 center-align">
        <div class="preloader-wrapper small active">
          <div class="spinner-layer">
            <div class="circle-clipper left">
              <div class="circle"></div>
            </div><div class="gap-patch">
              <div class="circle"></div>
            </div><div class="circle-clipper right">
              <div class="circle"></div>
            </div>
          </div>
        </div><br><span class="grey-text">cargando recetas</span>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m6 l4"  v-for="smoothie in smoothies" :key="smoothie.id">
        <div class="card">
          <div class="card-image">
            <!-- <img class="responsive-img" :src="require(`../assets/${smoothie.img}`)" /> -->
            <img :src="smoothie.imgUrl" alt=""/>
            <span class="card-title">{{ smoothie.title }}</span>
            <router-link :to="{name:'SmoothieEdit', params:{ id: smoothie.id }}" >
              <a style="margin-right: 60px" class="btn-floating halfway-fab yellow darken-3">
                  <i class="material-icons">edit</i>
              </a>
            </router-link>
            <a class="btn-floating halfway-fab red"  @click="DeleteSmoothie(smoothie.id)"><i class="material-icons">delete</i></a>
          </div>
          <div class="card-content">
            <h6>Ingredientes</h6>
            <div class="row">
              <div class="col s12">
                <div class="ingredients">
                  <span class="chip" v-for="(ing, index) in smoothie.ingredients" :key="index">{{ing}}</span>
                </div>
              </div>
            </div>
            <h6>Preparación</h6>
              <p style="word-wrap: break-word;" class="grey-text text-darken-1">{{smoothie.preparation}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/firebase/init'

export default {
  name: 'Smoothie',
  data(){
    return{
      loading:false,
      smoothies:[],
      db: firebase.firestore()
    }
  },
  methods:{
    DeleteSmoothie(id){
      this.db.collection('smoothies').doc(id).delete().then(() => {
        this.smoothies = this.smoothies.filter(smoothie => {
          return smoothie.id != id
        })
      })
    },
    EditSmoothie(){}
  },
  created(){
    this.loading = true
    this.db.collection('smoothies').onSnapshot((querySnapshot) => {
      this.smoothies = [];
        querySnapshot.forEach((doc) => {
              let smoothie = doc.data()
              smoothie.id = doc.id
              this.smoothies.push(smoothie)
        });
        this.loading = false
      },function(error) {
          alert('no es posible conectarce a internet');
          this.loading = false
    });
    $(document).ready(function () {
        $('.materialboxed').materialbox();
    });
  }
}
</script>

<style scoped>
/* npm install sass-loader node-sass webpack --save-dev for work with scss */

.ingredients{
  margin-top: 20px;
}
</style>

