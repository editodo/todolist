<template>
  <div>
    <v-card
      color="grey lighten-5"
      tile
    >
      <v-card-text>Mini DashBoard</v-card-text>
    </v-card>
    <v-card
      v-for="item in testData"
      :key="item.Title"
      color="grey lighten-5 pt-1 pb-1"
      tile
    >
      <v-card-text class="text-center pa-0 ma-0">
        {{ item.Title }}
      </v-card-text>
      <v-card-text class="d-flex justify-center text-center pa-0 ma-0 body-1">
        <v-chip
          class="ma-0 display-1"
        >
          {{ item.Value }}          
        </v-chip>
        <span class="align-self-end">
          건
        </span>
      </v-card-text>
      <!-- <v-card-actions class="pa-0 d-flex justify-center">        
        <v-btn
          text
          color="deep-purple accent-4"
        >          
          More          
        </v-btn>
      </v-card-actions> -->
    </v-card>
    
  
  
    <!-- <v-skeleton-loader
      v-for="n in 3"          
      :key="n"
      :loading="true"
      type="list-item-avatar-three-line"
    >
      <v-card>
        <v-card-title>Title</v-card-title>
        <v-card-text>Card Text</v-card-text>
      </v-card>
    </v-skeleton-loader> -->
  </div>
</template>

<script>
export default {
    data () {
      return {
          testData : [
              {Title:'기안대기', Value:7},
              {Title:'승인대기', Value:2},
              {Title:'결재진행중', Value:5},
              {Title:'결재완료', Value:3},              
          ]

      }

    }

}
</script>

<style>

</style>