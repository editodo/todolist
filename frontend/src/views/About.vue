<template>
  <div class="about">
    <h1>This is an about page</h1>

    {{ CurAuthInfo }}
  </div>
</template>


<script>
import {mapGetters} from 'vuex';

export default {
  computed :{
      ...mapGetters(['CurAuthInfo']), //현재 메뉴의 권한정보를 가져온다.
  },
  methods: {
    
  }
  
}
</script>