<template>
  <div class="index container section"><br>
    <div class="row">
      <div class="col s12 m6 l4"  v-for="smoothie in smoothies" :key="smoothie.id">
        <div class="card">
          <div class="card-image">
            <!-- <img class="responsive-img" :src="require(`../assets/${smoothie.img}`)" /> -->
            <img :src="smoothie.imgUrl" alt=""/>
            <span class="card-title">{{ smoothie.title }}</span>
            <a style="margin-right: 60px" class="btn-floating halfway-fab waves-effect waves-light yellow darken-3 modal-trigger" href="#modal1" @click="EditSmoothie(smoothie.id)"><i class="material-icons">edit</i></a>
            <a class="btn-floating halfway-fab waves-effect waves-light red"  @click="DeleteSmoothie(smoothie.id)"><i class="material-icons">delete</i></a>
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
    <SmoothieForm />
  </div>
</template>

<script>
import firebase from '@/firebase/init'
import SmoothieForm from '@/components/SmoothieForm'
import { ImageUploader } from 'vue-image-upload-resize'

export default {
  name: 'Index',
  components:{
    SmoothieForm, ImageUploader
  },
  data(){
    return{
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
    
    this.db.collection('smoothies').onSnapshot((querySnapshot) => {
      this.smoothies = [];
        querySnapshot.forEach((doc) => {
              let smoothie = doc.data()
              smoothie.id = doc.id
              this.smoothies.push(smoothie)
        });
        console.log('ready data');
      },function(error) {
          alert('no es posible conectarce a internet');
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

