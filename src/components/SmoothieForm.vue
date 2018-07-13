<template>
    <div>
        <!-- Modal Structure -->
        <div id="modal1" class="modal">
            <h5 class="center-align pink z-depth-1 white-text" style="padding: 20px; margin:0px;">Nueva Receta</h5>
                <div class="modal-content">
                    <!-- <img src="" class="responsive-img" alt="image"> -->
                    <!-- {{progress}} <button class="btn" @click="progress = progress + 10"></button> -->
                    <!-- <div class="file-field input-field">
                        <div class="btn btn-flat lime">
                            <span>Buscar</span>
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text" placeholder="cargar imagen ( pocional )">
                            <input type="file" @change="onFileChanged">
                        </div>
                    </div> -->
                    <div class="center-align">
                        Seleccione una imagen ( opcional )
                    </div> 
                    <image-uploader style="padding: 30px"
                        :debug="1"
                        :maxWidth="640"
                        :quality="0.7"
                        outputFormat="blob"
                        :preview=true
                        class="center-align card"
                        capture="environment"
                        @input="setImage"
                        @onComplete="endImageResize"
                    >
                    </image-uploader>
                    <br>
                    <div class="field title">
                        <label for="title">Nombre:</label>
                        <input type="text" name="title" id="" v-model="smoothie.title" />
                        <span v-if="feedback" class="helper-text red-text">{{feedback}}</span>
                    </div>
                    <div class="field ingredients">
                        <label for="ingredients">Ingredientes: </label>
                        <div class="row">
                            <div class="col s9 m5">
                                <input type="text" name="ingredients" v-model="ingredient" />
                                <span v-if="feedback" class="helper-text red-text">{{feedback}}</span>
                            </div>
                            <div class="col s3 m7">
                                <button class="btn-small waves-light lime btn-flat" @click="AddIngredient" @keydown.enter="AddIngredient">
                                    <i class="material-icons">add</i>
                                </button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <span class="chip" v-for="(ing, index) in smoothie.ingredients" :key="index">
                                    {{ing}}
                                    <i class="material-icons tiny" @click="RemoveIngredient(index)">close</i>
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
                </div>
                <div class="modal-footer">
                    <div class="row">
                        <div class="col s12">
                            <div class="field center-align" v-if="loading">
                                {{msg}} {{progress}}% <br>
                                <div class="progress">
                                    <div class="determinate" v-bind:style="{width: progress + '%'}"></div>
                                </div>
                            </div>
                            <div class="field center-align">
                                <button href="#!" class=" white-text waves-effect waves-green btn pink" @click="onSave" :disabled="loading" >Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            <br />
        </div>
    </div>
</template>

<script>
import firebase from '@/firebase/init'
import slugify from 'slugify'
import { ImageUploader } from 'vue-image-upload-resize'

    export default {
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
                    imgUrl:'https://firebasestorage.googleapis.com/v0/b/vuebasecamp.appspot.com/o/recipes%2Fdefault.jpeg?alt=media&token=16c96b68-b1b2-4c9c-a8ad-4e4df69e5040',
                    ingredients:[],
                    preparation:null
                },
                storageRef:firebase.storage().ref(),
                recipesRef:null
            }
        },
        created(){
            $(document).ready(function(){
                $('.modal').modal();
                $('.fileInput').value = "Selecionar foto ( opcional )"
            });
            this.recipesRef = this.storageRef.child('recipes');
        },
        methods:{
            setImage(file){ //npm install --save vue-image-upload-resize
                this.selectedFile = file;
            },
            endImageResize(){
                console.log(this.selectedFile);
                
            },
            onFileChanged(event){
                //this.selectedFile = event.target.files[0];
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
                    this.feedback = null
                }else
                    this.feedback = 'ingresa un ingrediente'
            },
            RemoveIngredient(index){
                console.log(index);
                this.smoothie.ingredients.splice(index,1)
            },
            onSave(){
                if(this.smoothie.title){
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
                }else
                    this.feedback = 'debes poner un titulo'
            },
            AddSmoothie(){
                    var vm = this
                    this.db.collection('smoothies').add(this.smoothie).then(() => {
                        this.smoothie = {
                            title:null,
                            slug:null,
                            imgUrl:'https://firebasestorage.googleapis.com/v0/b/vuebasecamp.appspot.com/o/recipes%2Fdefault.jpeg?alt=media&token=16c96b68-b1b2-4c9c-a8ad-4e4df69e5040',
                            ingredients:[],
                            preparation:null
                        }
                        this.selectedFile = null
                        this.ingredient = null;
                        vm.msg = 'Guardado Exitoso!'
                        vm.progress = '100'
                        setTimeout(() => {
                            vm.msg = null;
                            vm.loading = false;
                        }, 2000);
                    });
            }
        }
    }
</script>

<style lang='scss' scoped>
.modal{
  max-height: 80% !important;
  bottom: 0px;
}

</style>