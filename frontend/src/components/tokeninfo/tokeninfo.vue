<template>
  <div>
    <v-card
      class="pa-0"    
      color="#414141"
    >
      <v-row class="pa-0">
        <v-col class="white--text pa-0 pl-5">
          <v-text-field
            v-model="curTime"
            class="centered-input"
            label="Session Time"
            outlined
            hide-details
            dense       
            readonly             
          />
        </v-col>
        <v-col class="pa-0">          
          <v-btn
            text            
            @click="reset"
          >
            <v-icon>update</v-icon>
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    data: () => ({
       curTime:'',
    }),
    computed : {
        ...mapGetters(['GET_TimeoutInfo']),

    },
   created: function(){

       //1초마다 남은시간 재계산
       setInterval(
           ()=>{               
               this.updateTime();               
           }, 1000);
    
       

   },  
   methods : {        
         
        ...mapActions(['TOKEN_UPDATE']),   //this.$store.dispatch('LOGIN')에 매핑    
        updateTime(){         
            
            var toDate = new Date(this.GET_TimeoutInfo);      
            var curDate = new Date();
            var currentTime = toDate.getTime() - curDate.getTime();
            
            if(currentTime < 0) 
            {
              this.curTime = "Time out!!!"
            }
            else
            {
              this.curTime = this.msToHMS(currentTime);

              /*
              console.log(this.msToHMS(currentTime));

              //var hh = currentTime.getHours();

              var mm = Math.floor(currentTime/(1000*60));

              var ss = Math.floor((currentTime%(1000*60)) / 1000);
              var time = mm +":" + ss;
              this.curTime = time;
              */

            }
        },

        msToHMS( ms ) {
            // 1- Convert to seconds:
            let seconds = ms / 1000;
            // 2- Extract hours:
            const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
            seconds = seconds % 3600; // seconds remaining after extracting hours
            // 3- Extract minutes:
            const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
            // 4- Keep only seconds not extracted to minutes:
            seconds = Math.floor(seconds % 60);

            
            return this.zeroInsert(hours)+":"+ this.zeroInsert(minutes)+":"+this.zeroInsert(seconds);
        },
        zeroInsert(mynumber)
        {          
          if(mynumber >= 10)
          {
            return mynumber;
          }
          
          return '0' + mynumber;
          
        },

        reset(){
            this.TOKEN_UPDATE();
        }
   },


}
</script>

<style>


</style>