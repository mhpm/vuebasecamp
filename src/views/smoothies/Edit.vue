<template>
    <div class="container"><br><br>
        <!-- Modal Structure -->
        <div class="row section">
            <div class="col s12">
                <h5 class="center-align pink white-text" style="padding: 20px; margin:0px;">
                    <span style="cursor: pointer;" class="left material-icons" @click="$router.push({name:'Smoothies'})">
                        arrow_back
                    </span>
                    <span  style="margin-left:-30px;">Editar {{smoothie.title}} </span>
                </h5>
                <form @submit.prevent="validateBeforeSubmit">
                        <br>
                        <div class="row center-align">
                            <div class="col s3">
                                <img :src="smoothie.imgUrl" class="responsive-img" alt="image" width="150"> <br/>
                                foto actual
                            </div>
                            <div class="col s9">
                                <div class="center-align">
                                    Añadir foto o remplazarla ( opcional )
                                </div> 
                                <image-uploader style="padding: 30px"
                                    :debug="1"
                                    :maxWidth="640"
                                    :quality="0.9"
                                    outputFormat="blob"
                                    :preview=true
                                    class="center-align uploader"
                                    capture="user"
                                    @input="setImage"
                                >
                                </image-uploader>
                            </div>
                        </div>
                        <br>
                        <div class="field title">
                            <label class="" for="title">Nombre:</label>
                            <input type="text" name="Nombre" id="" v-model="smoothie.title" v-validate="'required'" />
                            <span class="helper-text red-text">{{errors.first('Nombre')}}</span>
                        </div>
                        <div class="field ingredients">
                            <label for="ingredients">Ingredientes: </label>
                            <div class="row">
                                <div class="col s9 m5">
                                    <input type="text" name="ingredients" v-model="ingredient" />
                                    <span class="helper-text red-text">{{feedback}}</span>
                                </div>
                                <div class="col s3 m7">
                                    <button class="btn-small waves-light lime btn-flat" @click.prevent="AddIngredient" @keydown.enter.prevent="AddIngredient">
                                        <i class="material-icons">add</i>
                                    </button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col s12">
                                    <span class="chip" v-for="(ing, index) in smoothie.ingredients" :key="index">
                                        {{ing}}
                                        <i class="material-icons tiny" @click="RemoveIngredient(ing)">close</i>
                                    </span>
                                </div>
                            </div>
                            <div class="row">
                                <div class="input-field col s12">
                                    <textarea id="textarea1" class="materialize-textarea" v-model="smoothie.preparation"></textarea>
                                    <label for="textarea1">Preparación</label>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <div class="field center-align" v-if="loading">
                                    {{msg}} {{progress}}% <br>
                                    <div class="progress">
                                        <div class="determinate" v-bind:style="{width: progress + '%'}"></div>
                                    </div>
                                </div>
                                <div class="field center-align">
                                    <button href="#!" class=" white-text waves-effect waves-green btn pink" @click="validateBeforeSubmit" :disabled="loading" >Guardar</button>
                                </div>
                            </div>
                        </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from '@/firebase/init'
import slugify from 'slugify'
import { ImageUploader } from 'vue-image-upload-resize'

    export default {
        props: ['id'],
        components:{
            ImageUploader
        },
        data(){
            return{
                db: firebase.firestore(),
                msg:null,
                loading:null,
                progress:0,
                feedback: null,
                ingredient:null,
                selectedFile:null,
                smoothie:{
                    title:null,
                    slug:null,
                    imgUrl:null,
                    ingredients:[],
                    preparation:null
                },
                storageRef:firebase.storage().ref(),
                recipesRef:null
            }
        },
        created(){
            var vm = this
            $(document).ready(function(){
                $('.modal').modal({
                    onCloseStart: function(){
                        vm.ResetValues()
                    }
                });
            });
            this.recipesRef = this.storageRef.child('recipes');
            this.db.collection('smoothies').doc(this.$route.params.id).get().then(function(doc){
                if(doc.exists){
                    vm.smoothie = doc.data()
                }
            })
        },
        methods:{
            validateBeforeSubmit() {
                this.$validator.validateAll().then((result) => {
                    if (result) {
                        this.onSave()
                    }
                });
            },
            setImage(file){ //npm install --save vue-image-upload-resize
                 this.selectedFile = file;
            },
            onUpload() {
                // Listen for state changes, errors, and completion of the upload.
                var vm = this
                var uploadTask = this.storageRef.child('recipes/' + this.selectedFile.name).put(this.selectedFile);

                uploadTask.on('state_changed', function(snapshot){
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    vm.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    }, function(error) {
                        // Handle unsuccessful uploads
                        vm.msg = "No se pudo guardar, verifica tu conexion a internet o intentalo mas tarde"
                        vm.loading = false
                    }, function() {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                            console.log('File available at', downloadURL);
                            vm.smoothie.imgUrl = downloadURL
                            vm.AddSmoothie()
                        });;      
                });
            },
            AddIngredient(){
                if(this.ingredient){
                    this.smoothie.ingredients.push(this.ingredient)
                    this.ingredient = null
                }
            },
            RemoveIngredient(ing){
                //this.smoothie.ingredients.splice(index,1)
                this.smoothie.ingredients = this.smoothie.ingredients.filter(ingredient => {
                    return ingredient != ing
                })
            },
            onSave(){
                    this.feedback = null
                    this.smoothie.slug = slugify(this.smoothie.title,{
                        replacement: '-',
                        remove: /[$*_=~.()'"!\-:@]/g,
                        lower: true
                    })
                    this.loading = true
                    this.msg = 'Guardando, espere por favor'
                    if(this.selectedFile){
                        this.selectedFile.name = this.smoothie.slug
                        this.onUpload()
                    }
                    else
                        this.AddSmoothie()
            },
            AddSmoothie(){
                    var vm = this
                    this.db.collection('smoothies').doc(this.$route.params.id).set(this.smoothie).then(() => {
                        vm.msg = 'Guardado Exitoso!'
                        vm.progress = '100'
                        setTimeout(() => {
                            vm.loading = false;
                            vm.progress = null;
                            vm.$router.push({name:'Smoothies'})
                        }, 1000);
                    });
            }
        }
    }
</script>

<style lang='scss' scoped>
</style>