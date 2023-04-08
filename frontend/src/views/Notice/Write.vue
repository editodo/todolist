<template>
  <div class="pt-1">
    
    <v-card
      color="card_background"
      class="baseheight"
    >
      <v-toolbar
        flat        
        dense             
        class="title_font_color"
        :height="this.$vuetify.toolbar_height"
      >           
        <v-toolbar-title dense>
          <v-icon class="title_font_color toolbar_icon_size">edit</v-icon> <span class="toolbar_font_size">등록</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>          
        <v-row>
          <v-col>
            <v-text-field        
              v-model="BoardData.TITLE"
              label="제목"
              dense            
              required
              maxlength="128"
            />
          </v-col>
        </v-row>        
        <TiptapEditor 
          v-model="BoardData.CONTENTS"
          :editable="true"
        />
        <div class="text-right">

          <v-btn              
            text                
            @click="WriteData"
            v-if="(IsWrite == true)"
          >
            <v-icon left>
              save
            </v-icon>
            저장
          </v-btn>
          <v-btn              
            text
            to="/notice/list"
          >
            <v-icon left>
              list
            </v-icon>
            리스트
          </v-btn>
        </div>          
      </v-card-text>
    </v-card>
  
  </div>
</template>

<script>

import CONST from '@/const'
import axios from 'axios'
import TiptapEditor from '@/components/Tiptap/TiptapEditor.vue';
import {mapGetters} from 'vuex';


export default {
  components: {
    //'editor': Editor
    TiptapEditor : TiptapEditor
  },
  data: () => ({
    BoardData : {
      CREATER : '',   //작성자
      TITLE : '',     //제목 
      CONTENTS : '',  //내용
    },
            
  }),
  computed : {
      ...mapGetters(['IsWrite',
                    'IsDelete'
                    ]),
     
  },  
  methods: {
    WriteData : async function(){           //현재 입력 된 정보를 서버에 전송한다.

      if (await this.$root.$confirm.open('Confirm', '등록 하시겠습니까??', { color: 'primary' }) == false) return;  

      //게시물 정보를 전송한다.
      axios.post(`${CONST.HOST_ADDR}/notice/insertBoardData`, this.BoardData)
      .then(
        (ret)=>{
          console.log(ret);           
          this.$router.push('/notice/list');         //리스트 화면으로 이동한다.
        })
       .catch( error => {
						console.log('failed', error)
			});       

    },
  }
}
</script>

<style>



</style>