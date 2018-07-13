<template>
      <nav>
        <div class="nav-wrapper lime">
            <a href="#" style="margin-left: 50px" class="brand-logo title">Recetas</a>
            <a class="btn-floating btn-large halfway-fab pink modal-trigger" href="#modal1">
                <router-link to="">
                    <i class="material-icons">add</i>
                </router-link>
            </a>
            <!-- <ul id="nav-mobile" class=" right hide-on-med-and-down">
                <li><a href="sass.html">Sass</a></li>
                <li><a href="badges.html">Components</a></li>
                <li><a href="collapsible.html">JavaScript</a></li>
            </ul> -->
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'Navbar'
    }
</script>

<style scoped>

@media screen and (max-width: 995px) {
    .title {
        margin-left: 0px !important;
    }
}
</style>